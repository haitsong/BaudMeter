using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace com.BaudMeter.Agent
{
    using System.Runtime.InteropServices; // : This is for declaring our Win32 API
    using System.Net;
    using System.Net.NetworkInformation;
    using System.Net.Sockets;
    using System.Diagnostics;
    using com.BaudMeter.Agent.WebService;

    public class NetPingTest
    {

        /// <summary>
        /// enum to hold the possible connection states
        /// </summary>
        [Flags]
        enum ConnectionStatusEnum : int
        {
            INTERNET_CONNECTION_MODEM = 0x1,
            INTERNET_CONNECTION_LAN = 0x2,
            INTERNET_CONNECTION_PROXY = 0x4,
            INTERNET_RAS_INSTALLED = 0x10,
            INTERNET_CONNECTION_OFFLINE = 0x20,
            INTERNET_CONNECTION_CONFIGURED = 0x40
        }

        [DllImport("wininet", CharSet = CharSet.Auto)]
        static extern bool InternetGetConnectedState(ref ConnectionStatusEnum flags, int dw);

        public NetPingReport PingTestResult { get; set;  }

        /// <summary>
        /// method for retrieving the IP address from the host provided
        /// </summary>
        /// <param name="host">the host we need the address for</param>
        /// <returns></returns>
        private  IPAddress GetIpFromHost(ref string host)
        {
            //variable to hold our error message (if something fails)
            string errMessage = string.Empty;

            //IPAddress instance for holding the returned host
            IPAddress address = null;
            IPAddress[] addrArray = null;

            //wrap the attempt in a try..catch to capture
            //any exceptions that may occur
            try
            {
                var sw = new Stopwatch();
                sw.Start();
                // we want to clock the DNS resolve cost
                ServicePointManager.DnsRefreshTimeout = 0;
                ServicePointManager.EnableDnsRoundRobin = true;
                // try to flush the DNS cache.
                //get the host IP from the name provided
                // addrArray = Dns.GetHostEntry(host).AddressList;
                com.BaudMeter.DNS.Resolver resv = new com.BaudMeter.DNS.Resolver();
                resv.ClearCache();
                resv.UseCache = false;
                resv.TransportType = com.BaudMeter.DNS.TransportType.Tcp;
                var hostentry = resv.Resolve(host);
                addrArray =  hostentry.AddressList;
                sw.Stop();
                // pick anyone from the address of resolved, and ping test that one.
                int nAddr = addrArray == null ? 0 : addrArray.Length;
                address = nAddr==0? null :  addrArray[rand.Next(nAddr)];
                this.PingTestResult.DnsResolveTimeTaken = sw.ElapsedMilliseconds;
                this.PingTestResult.UtcTimeStamp = DateTime.UtcNow;
                this.PingTestResult.HostIp = address.ToString();
                this.PingTestResult.id = DateTime.UtcNow.Ticks.ToString() +  BaudAgentWorker.MacAddress;
                PingTestResult.Mac = BaudAgentWorker.MacAddress;

            }
            catch (SocketException ex)
            {
                //some DNS error happened, return the message
                errMessage = string.Format("DNS Error: {0}", ex.Message);
            }
            return address;
        }

        // random val generator;
        private Random rand = new Random();

        /// <summary>
        /// method to check the status of the pinging machines internet connection
        /// </summary>
        /// <returns></returns>
        private bool HasConnection()
        {
            //instance of our ConnectionStatusEnum
            ConnectionStatusEnum state = 0;

            //call the API
            InternetGetConnectedState(ref state, 0);

            //check the status, if not offline and the returned state
            //isnt 0 then we have a connection
            if (((int)ConnectionStatusEnum.INTERNET_CONNECTION_OFFLINE & (int)state) != 0)
            {
                //return true, we have a connection
                return false;
            }
            //return false, no connection available
            return true;
        }

        /// <summary>
        /// method to check the ping status of a provided host
        /// </summary>
        /// <param name="addr">the host we need to ping</param>
        /// <returns></returns>
        public void PingHost(string host)
        {
            this.PingTestResult = new NetPingReport();
            this.PingTestResult.Host = host;
            this.PingTestResult.Ip = BaudMeterAgentService.ServerReportedAgentIp;

            //IPAddress instance for holding the returned host
            IPAddress address = GetIpFromHost(ref host);
            //set the ping options, TTL 128
            PingOptions pingOptions = new PingOptions();
            //create a new ping instance
            Ping ping = new Ping();
            //32 byte buffer (create empty)
            byte[] buffer = new byte[32];
            //first make sure we actually have an internet connection
            if (HasConnection())
            {
                //try will ping the host 4 times (standard)
                for (int i = 0; i < 4; i++)
                {
                    try
                    {
                        //send the ping 4 times to the host and record the returned data.
                        //The Send() method expects 4 items:
                        //1) The IPAddress we are pinging
                        //2) The timeout value
                        //3) A buffer (our byte array)
                        //4) PingOptions
                        PingReply pingReply = ping.Send(address, 20000, buffer, pingOptions);
                        //make sure we dont have a null reply
                        if (pingReply != null && pingReply.Status== IPStatus.Success )
                        {
                            PingTestResult.PingBufferLength = pingReply.Buffer.Length;
                            PingTestResult.PingRoundTripTime = (int)(pingReply.RoundtripTime);
                            PingTestResult.PingStatus = pingReply.Status.ToString();
                            break;
                        }
                    }
                    catch (PingException )
                    {
                    }
                    catch (SocketException )
                    {
                    }
                }
            }
        }

    }

}
