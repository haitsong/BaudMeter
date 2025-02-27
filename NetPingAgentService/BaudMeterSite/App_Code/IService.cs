﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using com.BaudMeter.Agent;

// NOTE: You can use the "Rename" command on the "Refactor" menu to change the interface name "IService" in both code and config file together.
[ServiceContract]
public interface IService
{
    [OperationContract]
    BaudCommand PostReports(List<BandwidthReport> BandWidthResults, List<NetPingReport> PingResults, string EncryptedClientInstanceId);
}
