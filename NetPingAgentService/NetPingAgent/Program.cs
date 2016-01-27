using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceProcess;
using System.Text;
using System.Threading.Tasks;

namespace com.BaudMeter.Agent
{
    using System;
    using System.Configuration.Install;
    using System.Reflection;
    using System.ServiceProcess;
    using System.IO;

    public class Program 
    {
        static void Main(string[] args)
        {
            //AppDomain.CurrentDomain.UnhandledException += CurrentDomainUnhandledException;
            if (System.Environment.UserInteractive)
            {
                var fileloc = Assembly.GetExecutingAssembly().Location;
                Console.WriteLine(fileloc);
                string parameter = string.Concat(args);
                bool uninstall = parameter!=null && parameter.ToLower().Contains("u");
                var insparam = uninstall ? new string[] { "/u", fileloc } : new string[] { fileloc } ;
                ManagedInstallerClass.InstallHelper(insparam);
            }
            else
            {
                RunService();
            }
        }

        /// <summary>
        /// The main entry point for the application.
        /// </summary>
        static void RunService()
        {
            ServiceBase[] ServicesToRun;
            ServicesToRun = new ServiceBase[]
            {
                new BaudMeterAgentService()
            };
            ServiceBase.Run(ServicesToRun);
        }

    }


}

