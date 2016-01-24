using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BaudMeterAgent
{
    public class NetAgentTestResult
    {
        public DateTime TimeStamp
        {
            get; set;
        }

        public NetAgentTestResult()
        {
            TimeStamp = DateTime.UtcNow;
        }
    }

}
