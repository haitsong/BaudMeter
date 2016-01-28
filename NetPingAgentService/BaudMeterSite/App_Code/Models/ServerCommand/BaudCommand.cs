using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace com.BaudMeter.Agent
{
    public class BaudCommand
    {
        public string Ip { get; set; }
        public string[] Urls { get; set; }
        public int IntervalSeconds { get; set; }
        public int ReportBatch { get; set; }
        public string Crc { get; set; }
        public string ClientIdKey { get; set; }
    }
}
