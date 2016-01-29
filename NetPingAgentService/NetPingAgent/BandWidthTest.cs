using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace com.BaudMeter.Agent
{
    using System.Runtime.InteropServices; // : This is for declaring our Win32 API
    using System.Net;
    using System.Net.NetworkInformation;
    using System.Net.Sockets;
    using System.Threading;
    using com.BaudMeter.Agent.WebService;

    class BandWidthTest
    {

        private long bytesReceivedPrev = 0;
        private List<double> bandwidthRecords = new List<double>();
        private Thread bandwidthMeasureThread ;

        private double _bandwidth = 0;

        public BandwidthReport BandWidthResult { get; set; }

        private void ComputeBandWidth()
        {
            if(bandwidthRecords.Count>0)
            {
                int nRecords = 0;
                double total = 0;
                double bandx = 0;
                _bandwidth = bandwidthRecords.Average();
                // pick top 10 records (for the best 1 seconds's sustainable max bandwidth).
                for (int i = bandwidthRecords.Count - 1; i >= 0; i--)
                {
                    if (bandwidthRecords[i] < _bandwidth / 2)
                        continue;
                    nRecords++;
                    total += bandwidthRecords[i];
                    if (nRecords % 10 == 0)
                    {
                        bandx = total /10;
                        if (bandx > _bandwidth)
                        {
                            _bandwidth = bandx;
                        }
                        total = 0;
                        nRecords = 0;
                    }
                }
                this.BandWidthResult.NetBandwidth = _bandwidth;
            }
            bandwidthRecords.Clear();
        }


        private void RecordBandwidthUsage(double secondsElapsed)
        {
            NetworkInterface[] interfaces = NetworkInterface.GetAllNetworkInterfaces();
            long bytesReceived = 0;
            foreach (NetworkInterface inf in interfaces)
            {
                if (inf.OperationalStatus == OperationalStatus.Up &&
                    inf.NetworkInterfaceType != NetworkInterfaceType.Loopback &&
                    inf.NetworkInterfaceType != NetworkInterfaceType.Tunnel &&
                    inf.NetworkInterfaceType != NetworkInterfaceType.Unknown && !inf.IsReceiveOnly)
                {
                    bytesReceived += inf.GetIPv4Statistics().BytesReceived;
                }
            }

            if (bytesReceivedPrev > 0)
            {   // this will only be called during download.
                long bytesUsed = bytesReceived - bytesReceivedPrev;
                double bytesPerSec = bytesUsed / secondsElapsed;
                double kBytesPerSec = bytesPerSec / 1024;
                double mBitsPerSec = kBytesPerSec / 1024 * 8;
                if (bandwidthRecords.Count == 0|| mBitsPerSec * 2 > bandwidthRecords.Average() )
                {
                    bandwidthRecords.Add(mBitsPerSec);
                }
            }
            bytesReceivedPrev = bytesReceived;
        }

        private bool _stopTesting;
        private ManualResetEvent StartNICBandWidthRecording = new ManualResetEvent(false);

        public void StopTesting()
        {
            _stopTesting = true;
            StartNICBandWidthRecording.Set();
        }


        void InitiateDownloadAndTestSpeed()
        {
            DateTime prevTime = DateTime.Now;
            while (!this._stopTesting)
            {
                // wait for other thread to signal another bandwidth test.
                StartNICBandWidthRecording.WaitOne();
                // try to take data points once every 0.1 seconds.
                System.Threading.Thread.Sleep(100);
                DateTime dtnow = DateTime.Now;
                TimeSpan ts = (dtnow - prevTime);
                if (totalBytesDownloaded >0)
                {
                    RecordBandwidthUsage(ts.TotalMilliseconds/1000.0); // about 0.1 seconds.
                }
                prevTime = dtnow;
            }
            // now put back to 0 so the bandwidth recording is stopped.
        }

        public BandWidthTest()
        {
            bandwidthMeasureThread = new Thread(new ThreadStart(this.InitiateDownloadAndTestSpeed));
            bandwidthMeasureThread.Start();
        }

        double totalBytesDownloaded = 0;

        // we start a seperate thread to check NIC card speed.
        public void UrlDownloadSpeedAndBandWidthTest(string urlToTest)
        {
            IPGlobalProperties properties = IPGlobalProperties.GetIPGlobalProperties();
            var tcpStartStats = new TcpStatistics[] { properties.GetTcpIPv6Statistics(), properties.GetTcpIPv4Statistics() };
            this.BandWidthResult = new BandwidthReport(); //reset to new object;
            this.BandWidthResult.Url = urlToTest;
            this.BandWidthResult.Ip = BaudMeterAgentService.ServerReportedAgentIp;

            try
            {
                bytesReceivedPrev = 0;
                totalBytesDownloaded = 0;
                bandwidthRecords.Clear();
                using (WebClient client = new WebClient())
                {
                    StartNICBandWidthRecording.Set();
                    //DateTime Variable To Store Download Start Time.
                    DateTime dt1 = DateTime.UtcNow;
                    BandWidthResult.UtcTimeStamp = dt1;
                    //Number Of Bytes Downloaded Are Stored In ‘data’
                    System.IO.Stream os = client.OpenRead(urlToTest);
                    byte[] buffer = new byte[1024];
                    int nread=1;
                    while (nread>0)
                    {
                        nread = os.Read(buffer, 0, 1024);
                        totalBytesDownloaded += nread;
                    }
                    double mbytes = totalBytesDownloaded / 1024 / 1024;
                    //DateTime Variable To Store Download End Time.
                    DateTime dt2 = DateTime.UtcNow;
                    //To Calculate Speed in Kb Divide Value Of data by 1024 And Then by End Time Subtract Start Time To Know Download Per Second.
                    this.BandWidthResult.DownloadBandwidth = Math.Round(mbytes / (dt2 - dt1).TotalSeconds, 2)* 8; // report mbits per sec, not bytes.
                    var tcpEndStats = new TcpStatistics[] { properties.GetTcpIPv6Statistics(), properties.GetTcpIPv4Statistics() };
                    this.CalculateTcpStats(tcpStartStats, tcpEndStats);
                }
            }
            finally
            {
                StartNICBandWidthRecording.Reset();
                ComputeBandWidth();
                bandwidthRecords.Clear();
                totalBytesDownloaded = 0;
                bytesReceivedPrev = 0;
                BandWidthResult.id = this.BandWidthResult.UtcTimeStamp.Ticks.ToString() + BaudAgentWorker.ReportIdIndex + this.BandWidthResult.Ip;
            }

        }

        private void CalculateTcpStats(TcpStatistics[] statstart, TcpStatistics[] statsend )
        {
            double segtotal = (statsend[0].SegmentsSent + statsend[1].SegmentsSent) -(statstart[0].SegmentsSent + statstart[1].SegmentsSent);
            if (segtotal != 0)
            {
                double segreset = (statsend[0].SegmentsResent + statsend[1].SegmentsResent) - (statstart[0].SegmentsResent + statstart[1].SegmentsResent);
                double connreset = (statsend[0].ResetConnections + statsend[1].ResetConnections) - (statstart[0].ResetConnections + statstart[1].ResetConnections);
                double tcperr = (statsend[0].ErrorsReceived + statsend[1].ErrorsReceived) - (statstart[0].ErrorsReceived + statstart[1].ErrorsReceived);
                this.BandWidthResult.TcpErrorRate = tcperr / segtotal;
                this.BandWidthResult.TcpSegmentResentRate = segreset / segtotal;
                this.BandWidthResult.TcpConnResetRate = connreset / segtotal;
            }
        }


    }

}
