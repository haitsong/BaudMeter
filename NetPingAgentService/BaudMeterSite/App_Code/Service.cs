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
                string ipx = string.IsNullOrWhiteSpace(ip) ? defaultip : ip;
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
        catch (Exception ex)
        {
            res = new GeoCityInfo();
            res.City = ex.ToString();
        }
        return res;
    }

    public BaudCommand PostReports(List<BandwidthReport> BandWidthResults, List<NetPingReport> PingResults, string encryptedClientInstanceId)
    {
        string clientip = System.Web.HttpContext.Current.Request.UserHostAddress;
        var defaultCityInfo = GetCityInfo(clientip, clientip);

        foreach (var r in BandWidthResults)
        {
            r.City = GetCityInfo(r.Ip, clientip);
        }
        foreach (var r in PingResults)
        {
            r.City = GetCityInfo(r.Ip, clientip);
        }
        var cmd = new BaudCommand
        {
            Ip = clientip, // ip detected by server, need to report it by the client to make sure there is no change in between.
            Urls =
            new string[] {
                "http://mirror.internode.on.net/pub/test/10meg.test",
            },
            IntervalSeconds = 60,
            City = defaultCityInfo,
            ReportBatch = 1 // report everytime, no batch
        };
        SignCommand(cmd, encryptedClientInstanceId);
        return cmd;
    }

}
