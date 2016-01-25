using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BaudMeterAgent
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel;
    using System.Configuration.Install;
    using System.Linq;
    using System.ServiceProcess;
    using System.Text;

    namespace ConsoleApplication1
    {
        [RunInstaller(true)]
        public class BaudMeterAgentInstaller : Installer
        {
            public BaudMeterAgentInstaller()
            {
                var processInstaller = new ServiceProcessInstaller();
                var serviceInstaller = new ServiceInstaller();

                //set the privileges
                processInstaller.Account = ServiceAccount.LocalSystem;
                serviceInstaller.DisplayName = "BaudMeterAgent";
                serviceInstaller.Description = "Network meter agent to assist network performance";
                serviceInstaller.StartType = ServiceStartMode.Automatic;

                //must be the same as what was set in Program's constructor
                serviceInstaller.ServiceName = "BaudMeterAgent";
                this.Installers.Add(processInstaller);
                this.Installers.Add(serviceInstaller);
            }
        }
    }

}
