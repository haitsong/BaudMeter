using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using com.BaudMeter.Agent;
using MaxMind.Db;
using MaxMind.GeoIP2;
using MaxMind.GeoIP2.Responses;
using Newtonsoft.Json;
using System.Threading.Tasks;

// NOTE: You can use the "Rename" command on the "Refactor" menu to change the class name "Service" in code, svc and config file together.
public class Service : IService
{

    static DatabaseReader mmdbCityReader=null;

    private static DatabaseReader GeoIpCityReader
    {
        get
        {
            String loc = System.Web.Hosting.HostingEnvironment.MapPath(@"~\MaxMindDB\GeoLite2-City.mmdb");
            if (mmdbCityReader == null)
            {
                mmdbCityReader = new DatabaseReader(loc);
            }
            return mmdbCityReader;
        }
    }

    void SignCommand(BaudCommand cmd, string encyptedClientInstanceId)
    {
        string clientInstanceId = CommandSign.DecryptString(encyptedClientInstanceId);
        string contentstr = string.Join(",", cmd.Urls) + cmd.IntervalSeconds + cmd.Ip + cmd.ReportBatch;
        cmd.Crc = CommandSign.GetHash(contentstr, clientInstanceId);
    }

    private GeoCityInfo GetCityInfo(string ip, string defaultip)
    {
        GeoCityInfo res = null;
        try
        {
            if (GeoIpCityReader != null)
            {
                string ipx = string.IsNullOrWhiteSpace(ip) || ip.Length<=4 ? defaultip : ip;
                if (ipx.Length > 4)
                {
                    CityResponse resp = GeoIpCityReader.City(ipx);
                    if (resp != null)
                    {
                        res = new GeoCityInfo();
                        res.Latitude = resp.Location.Latitude;
                        res.Longitude = resp.Location.Longitude;
                        res.City = resp.City.Name;
                        res.Zip = resp.Postal.Code;
                        res.Country = resp.Country.Name;
                    }
                }
            }
        }
        catch (Exception ex)
        {
            res = new GeoCityInfo();
            res.City = ex.ToString();
        }
        return res;
    }

    private async Task<bool> InsertRecords(string jsonstr)
    {
        try
        {
            if (jsonstr.Length > 10)
            {
                var args = new dynamic[] { JsonConvert.DeserializeObject<dynamic>(jsonstr) };
                var res = await AzureDocDBHelper.BulkInsert(args);
            }
            return true;
        }
        catch(Exception ex)
        {
            Console.Write(ex.Message);
            return false;
        }
    }

    public BaudCommand PostReports(List<BandwidthReport> BandWidthResults, List<NetPingReport> PingResults, string encryptedClientInstanceId)
    {
        string clientip = System.Web.HttpContext.Current.Request.UserHostAddress;
        GeoCityInfo defaultCityInfo = null;
        try
        {
            defaultCityInfo = GetCityInfo(clientip, clientip);
            List<object> resultlist = new List<object>();
            foreach (var r in BandWidthResults)
            {
                r.City = GetCityInfo(r.Ip, clientip);
                resultlist.Add(r);
            }
            foreach (var r in PingResults)
            {
                r.City = GetCityInfo(r.Ip, clientip);
                resultlist.Add(r);
            }
            var jsonstr = JsonConvert.SerializeObject(resultlist);
            InsertRecords(jsonstr).Wait();
        }
        catch(Exception ex)
        {
            // even we have problem processing data, we still want to give commands back.
            Console.Write(ex.ToString());
        }
        var cmd = new BaudCommand
        {
            Ip = clientip, // ip detected by server, need to report it by the client to make sure there is no change in between.
            Urls =
            new string[] {
               "http://mirror.internode.on.net/pub/test/10meg.test",
               //  "http://localhost/"
            },
            IntervalSeconds = 20,
            City = defaultCityInfo,
            ReportBatch = 1 // report everytime, no batch
        };
        SignCommand(cmd, encryptedClientInstanceId);
        return cmd;
    }

}
