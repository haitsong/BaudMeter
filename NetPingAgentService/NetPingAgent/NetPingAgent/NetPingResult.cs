using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.NetworkInformation;
using System.Text;
using System.Threading.Tasks;

namespace BaudMeterAgent
{
    public class NetPingResult: NetAgentTestResult
    {
        public NetPingResult() : base() { }

        public long DnsResolveTimeTaken { get; set; }

        public PingReply NetPingReply { get; set;  }

        public string Host { get; set; }

        public override string ToString()
        {
            string PingReplyDetail = "";
            if(NetPingReply!=null)
            {
                PingReplyDetail = ", Address:'" + NetPingReply.Address + "'" +
                        ", BufferLength:" + NetPingReply.Buffer.Length +
                        ", RoundtripTime:" + NetPingReply.RoundtripTime;
            }
            return
                @"{{ TimeStamp: '" + base.TimeStamp + "'" +
                    ", Host:'" + Host +"'"+
                    ", DnsResolveTimeTaken:" + DnsResolveTimeTaken +
                    PingReplyDetail +
                  "}}";
        }

    }
}
