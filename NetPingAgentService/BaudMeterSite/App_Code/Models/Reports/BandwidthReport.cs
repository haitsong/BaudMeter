﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace com.BaudMeter.Agent
{
    public class BandwidthReport 
    {
        public BandwidthReport() { UtcTimeStamp = DateTime.UtcNow; }

        public string id { get; set; }

        public DateTime UtcTimeStamp { get; set; }

        public double NetBandwidth { get; set; }

        public double DownloadBandwidth { get; set;  }

        public string Url { get; set; } // http://localhost:32505/App_Code/Models/Reports/NetPingReport.cs

        // default, client will fill empty;
        public string Ip { get; set; }

        public double TcpErrorRate { get; set; }

        public double TcpSegmentResendRate { get; set; }
             
        public double TcpConnResetRate { get; set; }

        public string Mac { get; set; }

        public GeoCityInfo City { get; set; }

    }
}
