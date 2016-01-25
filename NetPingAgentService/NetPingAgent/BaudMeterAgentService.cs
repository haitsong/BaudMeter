using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Diagnostics;
using System.Linq;
using System.ServiceProcess;
using System.Text;
using System.Timers;
using System.Threading.Tasks;

namespace BaudMeterAgent
{
    public partial class BaudMeterAgentService : ServiceBase
    {

        private static System.Timers.Timer actionTriggerTimer;
        private static EventLog evtlog;

        public BaudMeterAgentService()
        {
            InitializeComponent();
            this.ServiceName = "BaudMeterAgent";
            evtlog = EventLog;
        }

        bool isWorkAlreadyRunning = false;
        NetAgentWorker worker = new NetAgentWorker();

        public static void WriteEvent(string fmt, params object[] args)
        {
            if (evtlog!=null)
            {
                evtlog.WriteEntry(string.Format(fmt, args));
            }
        }

        // Specify what you want to happen when the Elapsed event is 
        // raised.
        private void OnTimedEvent(object source, ElapsedEventArgs e)
        {
            WriteEvent("The Elapsed event was raised at {0}", e.SignalTime);
            try
            {
                if(!isWorkAlreadyRunning)
                {
                    isWorkAlreadyRunning = true;
                    // to avoid triggering it again and again.
                    worker.RunOnce();
                }
            }
            finally
            {
                isWorkAlreadyRunning = false;
            }
        }

        protected override void OnStart(string[] args)
        {
            WriteEvent("BaudMeterAgent Start ... ");
            // Create a timer with a 90 second interval.
            actionTriggerTimer = new System.Timers.Timer(15000);
            // Hook up the Elapsed event for the timer.
            actionTriggerTimer.Elapsed += new ElapsedEventHandler(OnTimedEvent);
            // Set the Interval to 2 seconds (2000 milliseconds).
            actionTriggerTimer.Interval = 90000;
            actionTriggerTimer.Enabled = true;
        }

        protected override void OnPause()
        {
            actionTriggerTimer.Enabled = false;
        }

        protected override void OnContinue()
        {
            actionTriggerTimer.Enabled = true;
        }

        protected override void OnStop()
        {
            WriteEvent("BaudMeterAgent Stopping ...");
            actionTriggerTimer.Enabled = false;
            worker.Stop();
        }

    }

}
