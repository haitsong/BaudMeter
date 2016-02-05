using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.NetworkInformation;
using System.Text;
using System.Threading.Tasks;

namespace com.BaudMeter.Agent
{

    public class NetPingReport 
    {
        public string id { get; set; }

        public NetPingReport() { UtcTimeStamp = DateTime.UtcNow; }

        public DateTime UtcTimeStamp { get; set; }

        public long DnsResolveTimeTaken { get; set; }

        // public PingReply NetPingReply { get; set; }
        public int PingBufferLength { get; set; }

        public int PingRoundTripTime { get; set; }

        public string PingStatus { get; set; }

        public string Host { get; set; }
		 
        public string HostIp { get; set; }

        public string Ip { get; set; }

        public GeoCityInfo City { get; set; }

        public string Mac { get; set; }

    }

}
