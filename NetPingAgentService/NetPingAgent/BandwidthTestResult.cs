using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BaudMeterAgent
{
    public class BandwidthTestResult : NetAgentTestResult
    {
        public BandwidthTestResult() : base() { }

        public double NetBandwidth { get; set; }

        public double DownloadBandwidth { get; set;  }

        public string Url { get; set; }

        // default, client will fill empty;
        private string _clientIp="IP";
        public string Ip { get { return this._clientIp; } set { _clientIp = value; } }

        public double TcpErrorRate { get; set; }

        public double TcpSegmentResentRate { get; set; }
             
        public double TcpConnResetRate { get; set; }

        public override string ToString()
        {
            return
                @"{{ TimeStamp: '" + base.TimeStamp + "' " +
                ", NetBandwidth: " +  NetBandwidth + 
                ", DownloadBandwidth:" + DownloadBandwidth+
                ", Url:'"+ Url + "'"+
                ", Ip:'"+Ip +"'"+
                ", TcpErrorRate:"+ TcpErrorRate +
                ", TcpSegmentResentRate:" + TcpSegmentResentRate +
                ", TcpConnResetRate:" + TcpConnResetRate +
                "}}";
        }

    }
}
