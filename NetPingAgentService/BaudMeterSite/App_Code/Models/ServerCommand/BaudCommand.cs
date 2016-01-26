using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace com.BaudMeter.Model
{
    public class BaudCommand
    {
        public string Ip { get; set; }
        public string[] Urls { get; set; }
        public int IntervalSeconds { get; set; }
        public int ReportBatch { get; set; }
    }
}
