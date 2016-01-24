using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BaudMeterAgent
{
    using System.Diagnostics;

    class NetAgentWorker
    {
        private BandWidthTest bandWidthTestAgent = new BandWidthTest();
        private NetPingTest pingTestAgent = new NetPingTest();
        public NetAgentWorker()
        {
        }

        public void RunOnce()
        {
            var url = "http://mirror.internode.on.net/pub/test/100meg.test";
            var urix = new Uri(url);
            bandWidthTestAgent.UrlDownloadSpeedAndBandWidthTest(url);
            var resband = bandWidthTestAgent.BandWidthResult;
            BaudMeterAgentService.WriteEvent(resband.ToString());
            pingTestAgent.PingHost(urix.Host);
            var resping = pingTestAgent.PingTestResult;
            BaudMeterAgentService.WriteEvent(resping.ToString());
        }

        public void Stop()
        {
            this.bandWidthTestAgent.StopTesting();
        }

    }
}
