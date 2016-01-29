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

    private static DocumentClient client;
    private static Database database;
    private static DocumentCollection collection;
    private static StoredProcedure bulkInsertStoreProc;

    public  static string  BulkInsertStoreProcUrl { get { return bulkInsertStoreProc.SelfLink;  } }
    public  static DocumentClient  Client { get { return client;  } }

    static AzureDocDBHelper()
    {
        if (bulkInsertStoreProc == null)
        {
            Init().Wait();
        }
    }

    async static Task<bool> Init()
    {
        bool result = false;
        try {
            String loc = System.Web.Hosting.HostingEnvironment.MapPath(@"~\JS\BulkImport.js");
            //Get a Document client
            client = new DocumentClient(new Uri(endpointUrl), authorizationKey);
            //Get, or Create, the Database
            database = await GetOrCreateDatabaseAsync(databaseId);
            //Get, or Create, the Document Collection
            collection = await GetOrCreateCollectionAsync(database.SelfLink, collectionId);
            string body = File.ReadAllText(loc);
            var sprocToCreate = new StoredProcedure
            {
                Id = "BulkImport",
                Body = body
            };
            var colSelfLink = collection.SelfLink;
            await CreateIfNotExistStoredProcedure(colSelfLink, sprocToCreate.Id, sprocToCreate);
            result = true;
        }
        catch (DocumentClientException de)
        {
            Exception baseException = de.GetBaseException();
            // Console.WriteLine("{0} error occurred: {1}, Message: {2}", de.StatusCode, de.Message, baseException.Message);
        }
        catch (Exception e)
        {
            Exception baseException = e.GetBaseException();
            // Console.WriteLine("Error: {0}, Message: {1}", e.Message, baseException.Message);
        }
        return result;
    }

    //Assign a id for your database & collection 
    private static readonly string databaseId = ConfigurationManager.AppSettings["DatabaseId"];
    private static readonly string collectionId = ConfigurationManager.AppSettings["CollectionId"];

    //Read the DocumentDB endpointUrl and authorisationKeys from config
    //These values are available from the Azure Management Portal on the DocumentDB Account Blade under "Keys"
    //NB > Keep these values in a safe & secure location. Together they provide Administrative access to your DocDB account
    private static readonly string endpointUrl = ConfigurationManager.AppSettings["AccountEndpoint"];
    private static readonly string authorizationKey = ConfigurationManager.AppSettings["AuthorizationKey"];

    public static async Task<int> BulkInsert(dynamic[] args)
    {
        int res = 0;
        if (bulkInsertStoreProc != null && !string.IsNullOrEmpty(bulkInsertStoreProc.SelfLink))
        {
            StoredProcedureResponse<int> scriptResult = await client.ExecuteStoredProcedureAsync<int>(bulkInsertStoreProc.SelfLink, args);
            res = scriptResult.Response;
        }
        return res;
    }

    /// <summary>
    /// If a Stored Procedure is found on the DocumentCollection for the Id supplied it is deleted
    /// </summary>
    /// <param name="colSelfLink">DocumentCollection to search for the Stored Procedure</param>
    /// <param name="sprocId">Id of the Stored Procedure to delete</param>
    /// <returns></returns>
    private static async Task CreateIfNotExistStoredProcedure(string colSelfLink, string sprocId, StoredProcedure sprocToCreate)
    {
        StoredProcedure existingSpFound = client.CreateStoredProcedureQuery(colSelfLink).Where(s => s.Id == sprocId).AsEnumerable().FirstOrDefault();
        if (existingSpFound == null)
        {
            var resOfCreate = await client.CreateStoredProcedureAsync(colSelfLink, sprocToCreate);
            bulkInsertStoreProc = resOfCreate.Resource;
            // await client.DeleteStoredProcedureAsync(foundSpToDelete.SelfLink);
        }
        else
        {
            bulkInsertStoreProc = existingSpFound;
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
        var dbx = client.CreateDatabaseQuery().Where(db => db.Id == id).ToArray().FirstOrDefault();
        if (dbx == null)
        {
            dbx = await client.CreateDatabaseAsync(new Database { Id = id });
        }

        return dbx;
    }
}

