﻿//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//     Runtime Version:4.0.30319.42000
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace com.BaudMeter.Agent.WebService {
    using System.Runtime.Serialization;
    using System;
    
    
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Runtime.Serialization", "4.0.0.0")]
    [System.Runtime.Serialization.DataContractAttribute(Name="BandwidthReport", Namespace="http://schemas.datacontract.org/2004/07/com.BaudMeter.Agent")]
    [System.SerializableAttribute()]
    public partial class BandwidthReport : object, System.Runtime.Serialization.IExtensibleDataObject, System.ComponentModel.INotifyPropertyChanged {
        
        [System.NonSerializedAttribute()]
        private System.Runtime.Serialization.ExtensionDataObject extensionDataField;
        
        [System.Runtime.Serialization.OptionalFieldAttribute()]
        private com.BaudMeter.Agent.WebService.GeoCityInfo CityField;
        
        [System.Runtime.Serialization.OptionalFieldAttribute()]
        private double DownloadBandwidthField;
        
        [System.Runtime.Serialization.OptionalFieldAttribute()]
        private string IpField;
        
        [System.Runtime.Serialization.OptionalFieldAttribute()]
        private string MacField;
        
        [System.Runtime.Serialization.OptionalFieldAttribute()]
        private double NetBandwidthField;
        
        [System.Runtime.Serialization.OptionalFieldAttribute()]
        private double TcpConnResetRateField;
        
        [System.Runtime.Serialization.OptionalFieldAttribute()]
        private double TcpErrorRateField;
        
        [System.Runtime.Serialization.OptionalFieldAttribute()]
        private double TcpSegmentResendRateField;
        
        [System.Runtime.Serialization.OptionalFieldAttribute()]
        private string UrlField;
        
        [System.Runtime.Serialization.OptionalFieldAttribute()]
        private System.DateTime UtcTimeStampField;
        
        [System.Runtime.Serialization.OptionalFieldAttribute()]
        private string idField;
        
        [global::System.ComponentModel.BrowsableAttribute(false)]
        public System.Runtime.Serialization.ExtensionDataObject ExtensionData {
            get {
                return this.extensionDataField;
            }
            set {
                this.extensionDataField = value;
            }
        }
        
        [System.Runtime.Serialization.DataMemberAttribute()]
        public com.BaudMeter.Agent.WebService.GeoCityInfo City {
            get {
                return this.CityField;
            }
            set {
                if ((object.ReferenceEquals(this.CityField, value) != true)) {
                    this.CityField = value;
                    this.RaisePropertyChanged("City");
                }
            }
        }
        
        [System.Runtime.Serialization.DataMemberAttribute()]
        public double DownloadBandwidth {
            get {
                return this.DownloadBandwidthField;
            }
            set {
                if ((this.DownloadBandwidthField.Equals(value) != true)) {
                    this.DownloadBandwidthField = value;
                    this.RaisePropertyChanged("DownloadBandwidth");
                }
            }
        }
        
        [System.Runtime.Serialization.DataMemberAttribute()]
        public string Ip {
            get {
                return this.IpField;
            }
            set {
                if ((object.ReferenceEquals(this.IpField, value) != true)) {
                    this.IpField = value;
                    this.RaisePropertyChanged("Ip");
                }
            }
        }
        
        [System.Runtime.Serialization.DataMemberAttribute()]
        public string Mac {
            get {
                return this.MacField;
            }
            set {
                if ((object.ReferenceEquals(this.MacField, value) != true)) {
                    this.MacField = value;
                    this.RaisePropertyChanged("Mac");
                }
            }
        }
        
        [System.Runtime.Serialization.DataMemberAttribute()]
        public double NetBandwidth {
            get {
                return this.NetBandwidthField;
            }
            set {
                if ((this.NetBandwidthField.Equals(value) != true)) {
                    this.NetBandwidthField = value;
                    this.RaisePropertyChanged("NetBandwidth");
                }
            }
        }
        
        [System.Runtime.Serialization.DataMemberAttribute()]
        public double TcpConnResetRate {
            get {
                return this.TcpConnResetRateField;
            }
            set {
                if ((this.TcpConnResetRateField.Equals(value) != true)) {
                    this.TcpConnResetRateField = value;
                    this.RaisePropertyChanged("TcpConnResetRate");
                }
            }
        }
        
        [System.Runtime.Serialization.DataMemberAttribute()]
        public double TcpErrorRate {
            get {
                return this.TcpErrorRateField;
            }
            set {
                if ((this.TcpErrorRateField.Equals(value) != true)) {
                    this.TcpErrorRateField = value;
                    this.RaisePropertyChanged("TcpErrorRate");
                }
            }
        }
        
        [System.Runtime.Serialization.DataMemberAttribute()]
        public double TcpSegmentResendRate {
            get {
                return this.TcpSegmentResendRateField;
            }
            set {
                if ((this.TcpSegmentResendRateField.Equals(value) != true)) {
                    this.TcpSegmentResendRateField = value;
                    this.RaisePropertyChanged("TcpSegmentResendRate");
                }
            }
        }
        
        [System.Runtime.Serialization.DataMemberAttribute()]
        public string Url {
            get {
                return this.UrlField;
            }
            set {
                if ((object.ReferenceEquals(this.UrlField, value) != true)) {
                    this.UrlField = value;
                    this.RaisePropertyChanged("Url");
                }
            }
        }
        
        [System.Runtime.Serialization.DataMemberAttribute()]
        public System.DateTime UtcTimeStamp {
            get {
                return this.UtcTimeStampField;
            }
            set {
                if ((this.UtcTimeStampField.Equals(value) != true)) {
                    this.UtcTimeStampField = value;
                    this.RaisePropertyChanged("UtcTimeStamp");
                }
            }
        }
        
        [System.Runtime.Serialization.DataMemberAttribute()]
        public string id {
            get {
                return this.idField;
            }
            set {
                if ((object.ReferenceEquals(this.idField, value) != true)) {
                    this.idField = value;
                    this.RaisePropertyChanged("id");
                }
            }
        }
        
        public event System.ComponentModel.PropertyChangedEventHandler PropertyChanged;
        
        protected void RaisePropertyChanged(string propertyName) {
            System.ComponentModel.PropertyChangedEventHandler propertyChanged = this.PropertyChanged;
            if ((propertyChanged != null)) {
                propertyChanged(this, new System.ComponentModel.PropertyChangedEventArgs(propertyName));
            }
        }
    }
    
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Runtime.Serialization", "4.0.0.0")]
    [System.Runtime.Serialization.DataContractAttribute(Name="GeoCityInfo", Namespace="http://schemas.datacontract.org/2004/07/com.BaudMeter.Agent")]
    [System.SerializableAttribute()]
    public partial class GeoCityInfo : object, System.Runtime.Serialization.IExtensibleDataObject, System.ComponentModel.INotifyPropertyChanged {
        
        [System.NonSerializedAttribute()]
        private System.Runtime.Serialization.ExtensionDataObject extensionDataField;
        
        [System.Runtime.Serialization.OptionalFieldAttribute()]
        private string CityField;
        
        [System.Runtime.Serialization.OptionalFieldAttribute()]
        private string CountryField;
        
        [System.Runtime.Serialization.OptionalFieldAttribute()]
        private System.Nullable<double> LatitudeField;
        
        [System.Runtime.Serialization.OptionalFieldAttribute()]
        private System.Nullable<double> LongitudeField;
        
        [System.Runtime.Serialization.OptionalFieldAttribute()]
        private string ZipField;
        
        [global::System.ComponentModel.BrowsableAttribute(false)]
        public System.Runtime.Serialization.ExtensionDataObject ExtensionData {
            get {
                return this.extensionDataField;
            }
            set {
                this.extensionDataField = value;
            }
        }
        
        [System.Runtime.Serialization.DataMemberAttribute()]
        public string City {
            get {
                return this.CityField;
            }
            set {
                if ((object.ReferenceEquals(this.CityField, value) != true)) {
                    this.CityField = value;
                    this.RaisePropertyChanged("City");
                }
            }
        }
        
        [System.Runtime.Serialization.DataMemberAttribute()]
        public string Country {
            get {
                return this.CountryField;
            }
            set {
                if ((object.ReferenceEquals(this.CountryField, value) != true)) {
                    this.CountryField = value;
                    this.RaisePropertyChanged("Country");
                }
            }
        }
        
        [System.Runtime.Serialization.DataMemberAttribute()]
        public System.Nullable<double> Latitude {
            get {
                return this.LatitudeField;
            }
            set {
                if ((this.LatitudeField.Equals(value) != true)) {
                    this.LatitudeField = value;
                    this.RaisePropertyChanged("Latitude");
                }
            }
        }
        
        [System.Runtime.Serialization.DataMemberAttribute()]
        public System.Nullable<double> Longitude {
            get {
                return this.LongitudeField;
            }
            set {
                if ((this.LongitudeField.Equals(value) != true)) {
                    this.LongitudeField = value;
                    this.RaisePropertyChanged("Longitude");
                }
            }
        }
        
        [System.Runtime.Serialization.DataMemberAttribute()]
        public string Zip {
            get {
                return this.ZipField;
            }
            set {
                if ((object.ReferenceEquals(this.ZipField, value) != true)) {
                    this.ZipField = value;
                    this.RaisePropertyChanged("Zip");
                }
            }
        }
        
        public event System.ComponentModel.PropertyChangedEventHandler PropertyChanged;
        
        protected void RaisePropertyChanged(string propertyName) {
            System.ComponentModel.PropertyChangedEventHandler propertyChanged = this.PropertyChanged;
            if ((propertyChanged != null)) {
                propertyChanged(this, new System.ComponentModel.PropertyChangedEventArgs(propertyName));
            }
        }
    }
    
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Runtime.Serialization", "4.0.0.0")]
    [System.Runtime.Serialization.DataContractAttribute(Name="NetPingReport", Namespace="http://schemas.datacontract.org/2004/07/com.BaudMeter.Agent")]
    [System.SerializableAttribute()]
    public partial class NetPingReport : object, System.Runtime.Serialization.IExtensibleDataObject, System.ComponentModel.INotifyPropertyChanged {
        
        [System.NonSerializedAttribute()]
        private System.Runtime.Serialization.ExtensionDataObject extensionDataField;
        
        [System.Runtime.Serialization.OptionalFieldAttribute()]
        private com.BaudMeter.Agent.WebService.GeoCityInfo CityField;
        
        [System.Runtime.Serialization.OptionalFieldAttribute()]
        private long DnsResolveTimeTakenField;
        
        [System.Runtime.Serialization.OptionalFieldAttribute()]
        private string HostField;
        
        [System.Runtime.Serialization.OptionalFieldAttribute()]
        private string HostIpField;
        
        [System.Runtime.Serialization.OptionalFieldAttribute()]
        private string IpField;
        
        [System.Runtime.Serialization.OptionalFieldAttribute()]
        private string MacField;
        
        [System.Runtime.Serialization.OptionalFieldAttribute()]
        private int PingBufferLengthField;
        
        [System.Runtime.Serialization.OptionalFieldAttribute()]
        private int PingRoundTripTimeField;
        
        [System.Runtime.Serialization.OptionalFieldAttribute()]
        private string PingStatusField;
        
        [System.Runtime.Serialization.OptionalFieldAttribute()]
        private System.DateTime UtcTimeStampField;
        
        [System.Runtime.Serialization.OptionalFieldAttribute()]
        private string idField;
        
        [global::System.ComponentModel.BrowsableAttribute(false)]
        public System.Runtime.Serialization.ExtensionDataObject ExtensionData {
            get {
                return this.extensionDataField;
            }
            set {
                this.extensionDataField = value;
            }
        }
        
        [System.Runtime.Serialization.DataMemberAttribute()]
        public com.BaudMeter.Agent.WebService.GeoCityInfo City {
            get {
                return this.CityField;
            }
            set {
                if ((object.ReferenceEquals(this.CityField, value) != true)) {
                    this.CityField = value;
                    this.RaisePropertyChanged("City");
                }
            }
        }
        
        [System.Runtime.Serialization.DataMemberAttribute()]
        public long DnsResolveTimeTaken {
            get {
                return this.DnsResolveTimeTakenField;
            }
            set {
                if ((this.DnsResolveTimeTakenField.Equals(value) != true)) {
                    this.DnsResolveTimeTakenField = value;
                    this.RaisePropertyChanged("DnsResolveTimeTaken");
                }
            }
        }
        
        [System.Runtime.Serialization.DataMemberAttribute()]
        public string Host {
            get {
                return this.HostField;
            }
            set {
                if ((object.ReferenceEquals(this.HostField, value) != true)) {
                    this.HostField = value;
                    this.RaisePropertyChanged("Host");
                }
            }
        }
        
        [System.Runtime.Serialization.DataMemberAttribute()]
        public string HostIp {
            get {
                return this.HostIpField;
            }
            set {
                if ((object.ReferenceEquals(this.HostIpField, value) != true)) {
                    this.HostIpField = value;
                    this.RaisePropertyChanged("HostIp");
                }
            }
        }
        
        [System.Runtime.Serialization.DataMemberAttribute()]
        public string Ip {
            get {
                return this.IpField;
            }
            set {
                if ((object.ReferenceEquals(this.IpField, value) != true)) {
                    this.IpField = value;
                    this.RaisePropertyChanged("Ip");
                }
            }
        }
        
        [System.Runtime.Serialization.DataMemberAttribute()]
        public string Mac {
            get {
                return this.MacField;
            }
            set {
                if ((object.ReferenceEquals(this.MacField, value) != true)) {
                    this.MacField = value;
                    this.RaisePropertyChanged("Mac");
                }
            }
        }
        
        [System.Runtime.Serialization.DataMemberAttribute()]
        public int PingBufferLength {
            get {
                return this.PingBufferLengthField;
            }
            set {
                if ((this.PingBufferLengthField.Equals(value) != true)) {
                    this.PingBufferLengthField = value;
                    this.RaisePropertyChanged("PingBufferLength");
                }
            }
        }
        
        [System.Runtime.Serialization.DataMemberAttribute()]
        public int PingRoundTripTime {
            get {
                return this.PingRoundTripTimeField;
            }
            set {
                if ((this.PingRoundTripTimeField.Equals(value) != true)) {
                    this.PingRoundTripTimeField = value;
                    this.RaisePropertyChanged("PingRoundTripTime");
                }
            }
        }
        
        [System.Runtime.Serialization.DataMemberAttribute()]
        public string PingStatus {
            get {
                return this.PingStatusField;
            }
            set {
                if ((object.ReferenceEquals(this.PingStatusField, value) != true)) {
                    this.PingStatusField = value;
                    this.RaisePropertyChanged("PingStatus");
                }
            }
        }
        
        [System.Runtime.Serialization.DataMemberAttribute()]
        public System.DateTime UtcTimeStamp {
            get {
                return this.UtcTimeStampField;
            }
            set {
                if ((this.UtcTimeStampField.Equals(value) != true)) {
                    this.UtcTimeStampField = value;
                    this.RaisePropertyChanged("UtcTimeStamp");
                }
            }
        }
        
        [System.Runtime.Serialization.DataMemberAttribute()]
        public string id {
            get {
                return this.idField;
            }
            set {
                if ((object.ReferenceEquals(this.idField, value) != true)) {
                    this.idField = value;
                    this.RaisePropertyChanged("id");
                }
            }
        }
        
        public event System.ComponentModel.PropertyChangedEventHandler PropertyChanged;
        
        protected void RaisePropertyChanged(string propertyName) {
            System.ComponentModel.PropertyChangedEventHandler propertyChanged = this.PropertyChanged;
            if ((propertyChanged != null)) {
                propertyChanged(this, new System.ComponentModel.PropertyChangedEventArgs(propertyName));
            }
        }
    }
    
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Runtime.Serialization", "4.0.0.0")]
    [System.Runtime.Serialization.DataContractAttribute(Name="BaudCommand", Namespace="http://schemas.datacontract.org/2004/07/com.BaudMeter.Agent")]
    [System.SerializableAttribute()]
    public partial class BaudCommand : object, System.Runtime.Serialization.IExtensibleDataObject, System.ComponentModel.INotifyPropertyChanged {
        
        [System.NonSerializedAttribute()]
        private System.Runtime.Serialization.ExtensionDataObject extensionDataField;
        
        [System.Runtime.Serialization.OptionalFieldAttribute()]
        private com.BaudMeter.Agent.WebService.GeoCityInfo CityField;
        
        [System.Runtime.Serialization.OptionalFieldAttribute()]
        private string CrcField;
        
        [System.Runtime.Serialization.OptionalFieldAttribute()]
        private int IntervalSecondsField;
        
        [System.Runtime.Serialization.OptionalFieldAttribute()]
        private string IpField;
        
        [System.Runtime.Serialization.OptionalFieldAttribute()]
        private int ReportBatchField;
        
        [System.Runtime.Serialization.OptionalFieldAttribute()]
        private string[] UrlsField;
        
        [global::System.ComponentModel.BrowsableAttribute(false)]
        public System.Runtime.Serialization.ExtensionDataObject ExtensionData {
            get {
                return this.extensionDataField;
            }
            set {
                this.extensionDataField = value;
            }
        }
        
        [System.Runtime.Serialization.DataMemberAttribute()]
        public com.BaudMeter.Agent.WebService.GeoCityInfo City {
            get {
                return this.CityField;
            }
            set {
                if ((object.ReferenceEquals(this.CityField, value) != true)) {
                    this.CityField = value;
                    this.RaisePropertyChanged("City");
                }
            }
        }
        
        [System.Runtime.Serialization.DataMemberAttribute()]
        public string Crc {
            get {
                return this.CrcField;
            }
            set {
                if ((object.ReferenceEquals(this.CrcField, value) != true)) {
                    this.CrcField = value;
                    this.RaisePropertyChanged("Crc");
                }
            }
        }
        
        [System.Runtime.Serialization.DataMemberAttribute()]
        public int IntervalSeconds {
            get {
                return this.IntervalSecondsField;
            }
            set {
                if ((this.IntervalSecondsField.Equals(value) != true)) {
                    this.IntervalSecondsField = value;
                    this.RaisePropertyChanged("IntervalSeconds");
                }
            }
        }
        
        [System.Runtime.Serialization.DataMemberAttribute()]
        public string Ip {
            get {
                return this.IpField;
            }
            set {
                if ((object.ReferenceEquals(this.IpField, value) != true)) {
                    this.IpField = value;
                    this.RaisePropertyChanged("Ip");
                }
            }
        }
        
        [System.Runtime.Serialization.DataMemberAttribute()]
        public int ReportBatch {
            get {
                return this.ReportBatchField;
            }
            set {
                if ((this.ReportBatchField.Equals(value) != true)) {
                    this.ReportBatchField = value;
                    this.RaisePropertyChanged("ReportBatch");
                }
            }
        }
        
        [System.Runtime.Serialization.DataMemberAttribute()]
        public string[] Urls {
            get {
                return this.UrlsField;
            }
            set {
                if ((object.ReferenceEquals(this.UrlsField, value) != true)) {
                    this.UrlsField = value;
                    this.RaisePropertyChanged("Urls");
                }
            }
        }
        
        public event System.ComponentModel.PropertyChangedEventHandler PropertyChanged;
        
        protected void RaisePropertyChanged(string propertyName) {
            System.ComponentModel.PropertyChangedEventHandler propertyChanged = this.PropertyChanged;
            if ((propertyChanged != null)) {
                propertyChanged(this, new System.ComponentModel.PropertyChangedEventArgs(propertyName));
            }
        }
    }
    
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.ServiceModel", "4.0.0.0")]
    [System.ServiceModel.ServiceContractAttribute(ConfigurationName="WebService.IService")]
    public interface IService {
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IService/PostReports", ReplyAction="http://tempuri.org/IService/PostReportsResponse")]
        com.BaudMeter.Agent.WebService.BaudCommand PostReports(com.BaudMeter.Agent.WebService.BandwidthReport[] BandWidthResults, com.BaudMeter.Agent.WebService.NetPingReport[] PingResults, string EncryptedClientInstanceId);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IService/PostReports", ReplyAction="http://tempuri.org/IService/PostReportsResponse")]
        System.Threading.Tasks.Task<com.BaudMeter.Agent.WebService.BaudCommand> PostReportsAsync(com.BaudMeter.Agent.WebService.BandwidthReport[] BandWidthResults, com.BaudMeter.Agent.WebService.NetPingReport[] PingResults, string EncryptedClientInstanceId);
    }
    
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.ServiceModel", "4.0.0.0")]
    public interface IServiceChannel : com.BaudMeter.Agent.WebService.IService, System.ServiceModel.IClientChannel {
    }
    
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.ServiceModel", "4.0.0.0")]
    public partial class ServiceClient : System.ServiceModel.ClientBase<com.BaudMeter.Agent.WebService.IService>, com.BaudMeter.Agent.WebService.IService {
        
        public ServiceClient() {
        }
        
        public ServiceClient(string endpointConfigurationName) : 
                base(endpointConfigurationName) {
        }
        
        public ServiceClient(string endpointConfigurationName, string remoteAddress) : 
                base(endpointConfigurationName, remoteAddress) {
        }
        
        public ServiceClient(string endpointConfigurationName, System.ServiceModel.EndpointAddress remoteAddress) : 
                base(endpointConfigurationName, remoteAddress) {
        }
        
        public ServiceClient(System.ServiceModel.Channels.Binding binding, System.ServiceModel.EndpointAddress remoteAddress) : 
                base(binding, remoteAddress) {
        }
        
        public com.BaudMeter.Agent.WebService.BaudCommand PostReports(com.BaudMeter.Agent.WebService.BandwidthReport[] BandWidthResults, com.BaudMeter.Agent.WebService.NetPingReport[] PingResults, string EncryptedClientInstanceId) {
            return base.Channel.PostReports(BandWidthResults, PingResults, EncryptedClientInstanceId);
        }
        
        public System.Threading.Tasks.Task<com.BaudMeter.Agent.WebService.BaudCommand> PostReportsAsync(com.BaudMeter.Agent.WebService.BandwidthReport[] BandWidthResults, com.BaudMeter.Agent.WebService.NetPingReport[] PingResults, string EncryptedClientInstanceId) {
            return base.Channel.PostReportsAsync(BandWidthResults, PingResults, EncryptedClientInstanceId);
        }
    }
}
