using Microsoft.Azure.Documents;
using Microsoft.Azure.Documents.Client;
using Microsoft.Azure.Documents.Linq;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Configuration;
using System.Diagnostics;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

/// <summary>
/// Summary description for AzureDocDBHelper
/// </summary>
public class AzureDocDBHelper
{
    public AzureDocDBHelper()
    {
        //
        // TODO: Add constructor logic here
        //
    }

    private static DocumentClient client;

    //Assign a id for your database & collection 
    private static readonly string databaseId = ConfigurationManager.AppSettings["DatabaseId"];
    private static readonly string collectionId = ConfigurationManager.AppSettings["CollectionId"];

    //Read the DocumentDB endpointUrl and authorisationKeys from config
    //These values are available from the Azure Management Portal on the DocumentDB Account Blade under "Keys"
    //NB > Keep these values in a safe & secure location. Together they provide Administrative access to your DocDB account
    private static readonly string endpointUrl = ConfigurationManager.AppSettings["AccountEndpoint"];
    private static readonly string authorizationKey = ConfigurationManager.AppSettings["AuthorizationKey"];

    public static void Main(string[] args)
    {
        try
        {
            //Get a Document client
            using (client = new DocumentClient(new Uri(endpointUrl), authorizationKey))
            {
                RunDemoAsync(databaseId, collectionId).Wait();
            }
        }
        catch (DocumentClientException de)
        {
            Exception baseException = de.GetBaseException();
            Console.WriteLine("{0} error occurred: {1}, Message: {2}", de.StatusCode, de.Message, baseException.Message);
        }
        catch (Exception e)
        {
            Exception baseException = e.GetBaseException();
            Console.WriteLine("Error: {0}, Message: {1}", e.Message, baseException.Message);
        }
        finally
        {
            Console.WriteLine("End of demo, press any key to exit.");
            Console.ReadKey();
        }
    }

    private static async Task RunDemoAsync(string databaseId, string collectionId)
    {
        //Get, or Create, the Database
        Database database = await GetOrCreateDatabaseAsync(databaseId);

        //Get, or Create, the Document Collection
        DocumentCollection collection = await GetOrCreateCollectionAsync(database.SelfLink, collectionId);

        //Run Bulk Import
        await RunBulkImport(collection.SelfLink);

        //Cleanup
        await client.DeleteDatabaseAsync(database.SelfLink);
    }

    /// <summary>
    /// Import many documents using stored procedure.
    /// </summary>
    private static async Task RunBulkImport(string colSelfLink)
    {
        string inputDirectory = @".\Data\";
        string inputFileMask = "*.json";
        int maxFiles = 2000;
        int maxScriptSize = 50000;

        // 1. Get the files.
        string[] fileNames = Directory.GetFiles(inputDirectory, inputFileMask);
        DirectoryInfo di = new DirectoryInfo(inputDirectory);
        FileInfo[] fileInfos = di.GetFiles(inputFileMask);

        // 2. Prepare for import.
        int currentCount = 0;
        int fileCount = maxFiles != 0 ? Math.Min(maxFiles, fileNames.Length) : fileNames.Length;

        // 3. Create stored procedure for this script.
        string body = File.ReadAllText(@".\JS\BulkImport.js");
        StoredProcedure sproc = new StoredProcedure
        {
            Id = "BulkImport",
            Body = body
        };

        await TryDeleteStoredProcedure(colSelfLink, sproc.Id);
        sproc = await client.CreateStoredProcedureAsync(colSelfLink, sproc);

        // 4. Create a batch of docs (MAX is limited by request size (2M) and to script for execution.           
        // We send batches of documents to create to script.
        // Each batch size is determined by MaxScriptSize.
        // MaxScriptSize should be so that:
        // -- it fits into one request (MAX reqest size is 16Kb).
        // -- it doesn't cause the script to time out.
        // -- it is possible to experiment with MaxScriptSize to get best perf given number of throttles, etc.
        while (currentCount < fileCount)
        {
            // 5. Create args for current batch.
            //    Note that we could send a string with serialized JSON and JSON.parse it on the script side,
            //    but that would cause script to run longer. Since script has timeout, unload the script as much
            //    as we can and do the parsing by client and framework. The script will get JavaScript objects.
            string argsJson = CreateBulkInsertScriptArguments(fileNames, currentCount, fileCount, maxScriptSize);
            var args = new dynamic[] { JsonConvert.DeserializeObject<dynamic>(argsJson) };

            // 6. execute the batch.
            StoredProcedureResponse<int> scriptResult = await client.ExecuteStoredProcedureAsync<int>(sproc.SelfLink, args);

            // 7. Prepare for next batch.
            int currentlyInserted = scriptResult.Response;
            currentCount += currentlyInserted;
        }

        // 8. Validate
        int numDocs = 0;
        string continuation = string.Empty;
        do
        {
            // Read document feed and count the number of documents.
            FeedResponse<dynamic> response = await client.ReadDocumentFeedAsync(colSelfLink, new FeedOptions { RequestContinuation = continuation });
            numDocs += response.Count;

            // Get the continuation so that we know when to stop.
            continuation = response.ResponseContinuation;
        }
        while (!string.IsNullOrEmpty(continuation));

        Console.WriteLine("Found {0} documents in the collection. There were originally {1} files in the Data directory\r\n", numDocs, fileCount);
    }

    /// <summary>
    /// Creates the script for insertion
    /// </summary>
    /// <param name="currentIndex">the current number of documents inserted. this marks the starting point for this script</param>
    /// <param name="maxScriptSize">the maximum number of characters that the script can have</param>
    /// <returns>Script as a string</returns>
    private static string CreateBulkInsertScriptArguments(string[] docFileNames, int currentIndex, int maxCount, int maxScriptSize)
    {
        var jsonDocumentArray = new StringBuilder();
        jsonDocumentArray.Append("[");

        if (currentIndex >= maxCount) return string.Empty;
        jsonDocumentArray.Append(File.ReadAllText(docFileNames[currentIndex]));

        int scriptCapacityRemaining = maxScriptSize;
        string separator = string.Empty;

        int i = 1;
        while (jsonDocumentArray.Length < scriptCapacityRemaining && (currentIndex + i) < maxCount)
        {
            jsonDocumentArray.Append(", " + File.ReadAllText(docFileNames[currentIndex + i]));
            i++;
        }

        jsonDocumentArray.Append("]");
        return jsonDocumentArray.ToString();
    }


    /// <summary>
    /// If a Stored Procedure is found on the DocumentCollection for the Id supplied it is deleted
    /// </summary>
    /// <param name="colSelfLink">DocumentCollection to search for the Stored Procedure</param>
    /// <param name="sprocId">Id of the Stored Procedure to delete</param>
    /// <returns></returns>
    private static async Task TryDeleteStoredProcedure(string colSelfLink, string sprocId)
    {
        StoredProcedure sproc = client.CreateStoredProcedureQuery(colSelfLink).Where(s => s.Id == sprocId).AsEnumerable().FirstOrDefault();
        if (sproc != null)
        {
            await client.DeleteStoredProcedureAsync(sproc.SelfLink);
        }
    }


    /// <summary>
    /// Get a DocumentCollection by id, or create a new one if one with the id provided doesn't exist.
    /// </summary>
    /// <param name="id">The id of the DocumentCollection to search for, or create.</param>
    /// <returns>The matched, or created, DocumentCollection object</returns>
    private static async Task<DocumentCollection> GetOrCreateCollectionAsync(string dbLink, string id)
    {
        DocumentCollection collection = client.CreateDocumentCollectionQuery(dbLink).Where(c => c.Id == id).ToArray().FirstOrDefault();
        if (collection == null)
        {
            collection = new DocumentCollection { Id = id };
            collection.IndexingPolicy.IncludedPaths.Add(new IncludedPath
            {
                Path = "/*",
                Indexes = new Collection<Index>(new Index[]
                {
                        new RangeIndex(DataType.Number) { Precision = -1},
                        new RangeIndex(DataType.String) { Precision = -1},
                }),
            });

            collection = await client.CreateDocumentCollectionAsync(dbLink, collection);
        }

        return collection;
    }

    /// <summary>
    /// Get a Database by id, or create a new one if one with the id provided doesn't exist.
    /// </summary>
    /// <param name="id">The id of the Database to search for, or create.</param>
    /// <returns>The matched, or created, Database object</returns>
    private static async Task<Database> GetOrCreateDatabaseAsync(string id)
    {
        Database database = client.CreateDatabaseQuery().Where(db => db.Id == id).ToArray().FirstOrDefault();
        if (database == null)
        {
            database = await client.CreateDatabaseAsync(new Database { Id = id });
        }

        return database;
    }
}

