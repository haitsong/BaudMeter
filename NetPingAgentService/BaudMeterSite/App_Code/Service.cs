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
            if (mmdbCityReader == null)
            {
                mmdbCityReader = new DatabaseReader(@"..\MaxMindDB\GeoLite2-Country.mmdb");
            }
            return mmdbCityReader;
        }
    }

    void SignCommand(BaudCommand cmd, string encodedSessionKey)
    {
        string clientIdKey = CommandSign.DecryptString(encodedSessionKey);
        string contentstr = string.Join(",", cmd.Urls) + cmd.IntervalSeconds + cmd.Ip + cmd.ReportBatch;
        cmd.Crc = clientIdKey; // CommandSign.GetHash(contentstr, clientIdKey);

    }

    public BaudCommand PostReports(List<BandwidthReport> BandWidthResults, List<NetPingReport> PingResults, string encodedSessionKey)
    {
        string clientip = System.Web.HttpContext.Current.Request.UserHostAddress;
        foreach (var bw in BandWidthResults)
        {
            bw.Ip = clientip;                        
        }
        foreach(var pn in PingResults)
        {
            pn.Ip = clientip;
        }
        var cmd = new BaudCommand
        {
            Ip = clientip, // ip detected by server, need to report it by the client to make sure there is no change in between.
            Urls =
            new string[] {
                "http://mirror.internode.on.net/pub/test/10meg.test",
            },
            IntervalSeconds = 60,
            ReportBatch = 1 // report everytime, no batch
        };
        SignCommand(cmd, encodedSessionKey);
        return cmd;
    }

}
