using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace com.BaudMeter.Agent
{
    using System.Diagnostics;
    using com.BaudMeter.Agent.WebService;

    /// <summary>
    /// utility class to stringize data;
    /// </summary>
    static class HelperExtension
    {
        public static string ToSTR(this BandwidthReport rep)
        {
            return
                  @"{{ UtcTimeStamp: '" + rep.UtcTimeStamp + "' " +
                  ", NetBandwidth: " + rep.NetBandwidth +
                  ", DownloadBandwidth:" + rep.DownloadBandwidth +
                  ", Url:'" + rep.Url + "'" +
                  ", Ip:'" + rep.Ip + "'" +
                  ", TcpErrorRate:" + rep.TcpErrorRate +
                  ", TcpSegmentResentRate:" + rep.TcpSegmentResentRate +
                  ", TcpConnResetRate:" + rep.TcpConnResetRate +
                  "}}";
        }
        public static string ToSTR(this GeoCityInfo geocity)
        {
            if (geocity == null) return null;
            return
                  @"{{ Latitude: '" + geocity.Latitude + "' " +
                  ", Longitude: " + geocity.Longitude +
                  ", City:" + geocity.City +
                  ", Zip:'" + geocity.Zip + "'" +
                  ", Country:'" + geocity.Country + "'" +
                  "}}";
        }

        public static string ToSTR(this NetPingReport rep)
        {
            string PingReplyDetail = "";
            PingReplyDetail = 
                    ", BufferLength:" + rep.PingBufferLength +
                    ", RoundtripTime:" + rep.PingRondTripTime;
            return
                @"{{ UtcTimeStamp: '" + rep.UtcTimeStamp + "'" +
                    ", Host:'" + rep.Host + "'" +
                    ", ClientIp:'" + rep.Ip + "'" +
                    ", HostIp:'" + rep.HostIp + "'" +
                    ", DnsResolveTimeTaken:" + rep.DnsResolveTimeTaken +
                    PingReplyDetail +
                  "}}";
        }

        public static bool IsSigningValid(this BaudCommand cmd)
        {
            if (cmd != null)
            {
                string contentstr = string.Join(",", cmd.Urls) + cmd.IntervalSeconds + cmd.Ip + cmd.ReportBatch;
                string crc = cmd.Crc;
                string hash = ReportPostSign.GetHash(contentstr);
                BaudMeterAgentService.WriteEvent("ServerReports:  Ip={0},City={1}", cmd.Ip, cmd.City.ToSTR());
                return string.Compare(crc,hash, true)==0;
            }
            return false; 
        }

    }

    class BaudAgentWorker
    {
        private BandWidthTest bandWidthTestAgent = new BandWidthTest();
        private NetPingTest pingTestAgent = new NetPingTest();
        public BaudAgentWorker()
        {
        }

        static int runCount = 0;
        static int ReportBatchSize   = 1;

        static int reportidindex = 0;
        public static int ReportIdIndex { get { System.Threading.Interlocked.Increment(ref reportidindex); return reportidindex; } }

        static List<string> TestUrls = new List<string>();
        static List<NetPingReport> PingResults = new List<NetPingReport>();
        static List<BandwidthReport> BandwidthResults = new List<BandwidthReport>();

        private Random random = new Random();
        private void SetTestUrls(string[] testurls)
        {
            TestUrls.Clear();
            // random shuffle for the test arrays.
            string[] MyRandomArray = testurls.OrderBy(x => random.Next()).ToArray();
            TestUrls.AddRange(testurls);
        }


        public void RunOnce()
        {
            runCount = runCount > (1<<16) ?0 : (runCount + 1);
            foreach (string url in TestUrls)
            {
                RunTestForUrl(url);
            }
            if (runCount % ReportBatchSize == 0)
            {
                ReportToServer();
            }
        }

        private void RunTestForUrl(string url)
        {
            var urix = new Uri(url);
            bandWidthTestAgent.UrlDownloadSpeedAndBandWidthTest(url);
            var resband = bandWidthTestAgent.BandWidthResult;            
            BandwidthResults.Add(resband);
            BaudMeterAgentService.WriteEvent(resband.ToSTR());
            pingTestAgent.PingHost(urix.Host);
            var resping = pingTestAgent.PingTestResult;
            BaudMeterAgentService.WriteEvent(resping.ToSTR());
            PingResults.Add(resping);
        }

        
        private void ReportToServer()
        {
            try
            {
                // update server with the reports;
                // construct api call to report result.
                // post to server;
                var svc = new ServiceClient();
                var cmd = svc.PostReports(BandwidthResults.ToArray(), PingResults.ToArray(), Agent.ReportPostSign.EncryptedClientInstanceId);
                ExecuteServerCommand(cmd);
                // clear the reports in the client agent:
                PingResults.Clear();
                BandwidthResults.Clear();
            }
            catch (Exception ex)
            {
                BaudMeterAgentService.WriteEvent(ex.ToString());
            }
        }

        public void Stop()
        {
            this.bandWidthTestAgent.StopTesting();
        }

        public void ExecuteServerCommand(BaudCommand cmd)
        {
            // first: verify cmd have right signature.
            if (cmd != null && cmd.IsSigningValid())
            {
                BaudMeterAgentService.TimerInterval = cmd.IntervalSeconds * 1000;
                ReportBatchSize = cmd.ReportBatch;
                BaudMeterAgentService.ServerReportedAgentIp = cmd.Ip;
                // set the urls for testing, we shuffle it.
                this.SetTestUrls(cmd.Urls);
            }
        }

    }
}
