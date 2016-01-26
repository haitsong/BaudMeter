using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace com.BaudMeter.Model
{
    public class BandwidthReport 
    {
        public BandwidthReport() { UtcTimeStamp = DateTime.UtcNow; }

        public DateTime UtcTimeStamp { get; set; }

        public double NetBandwidth { get; set; }

        public double DownloadBandwidth { get; set;  }

        public string Url { get; set; }

        // default, client will fill empty;
        public string Ip { get; set; }

        public double TcpErrorRate { get; set; }

        public double TcpSegmentResentRate { get; set; }
             
        public double TcpConnResetRate { get; set; }

    }
}
