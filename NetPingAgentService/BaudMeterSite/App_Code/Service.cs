using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using com.BaudMeter.Model;

// NOTE: You can use the "Rename" command on the "Refactor" menu to change the class name "Service" in code, svc and config file together.
public class Service : IService
{
    public string CheckClientIp(string key)
    {
        string userip = System.Web.HttpContext.Current.Request.UserHostAddress;
        return userip+ key;
    }

    public BaudCommand PostReports(List<BandwidthReport> BandWidthResults, List<NetPingReport> PingResults)
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
        return new BaudCommand
        {
            Ip = clientip, // ip detected by server, need to report it by the client to make sure there is no change in between.
            Urls =
            new string[] {
                "http://mirror.internode.on.net/pub/test/10meg.test",
            },
            IntervalSeconds = 60,
            ReportBatch = 1 // report everytime, no batch
        };
    }

}
