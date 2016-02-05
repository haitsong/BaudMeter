using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using com.BaudMeter.Agent;
/// <summary>
/// Summary description for AzureSqlReportHelper
/// </summary>
public class AzureSqlReportHelper
{
    public AzureSqlReportHelper()
    {
    }

    void CallSqlAzure(string txt, System.Data.SqlClient.SqlConnection conn)
    {
        using (System.Data.SqlClient.SqlCommand cm = new System.Data.SqlClient.SqlCommand(txt, conn))
        {
            cm.CommandType = System.Data.CommandType.Text;
            cm.ExecuteNonQuery();
        }
    }

    public void InsertDB(List<BandwidthReport> bwlist, System.Data.SqlClient.SqlConnection conn)
    {
        if (bwlist != null && bwlist.Count > 0)
        {
            System.Text.StringBuilder sbSP = new System.Text.StringBuilder();
            sbSP.Append("insert into BandwidthReport ");
            sbSP.Append(SQLUtils.TableBandwidthReport);
            sbSP.Append(" values  ");
            System.Text.StringBuilder sb = new System.Text.StringBuilder();
            foreach (var bw in bwlist)
            {
                string delm = sb.Length == 0 ? "" : ",";
                sb.Append(delm);
                sb.Append(bw.GetString());
            }
            sbSP.Append(sb.ToString());
            sbSP.Append(" ; ");
            string cmdtx = sbSP.ToString();
            CallSqlAzure(cmdtx, conn);
        };
    }

    public void InsertDB(List<NetPingReport> pnlist, System.Data.SqlClient.SqlConnection conn)
    {
        if (pnlist != null && pnlist.Count > 0)
        {
            System.Text.StringBuilder sbSP = new System.Text.StringBuilder();
            sbSP.Append("insert into NetPingReport ");
            sbSP.Append(SQLUtils.TableNetPingReport);
            sbSP.Append(" values ");
            System.Text.StringBuilder sb = new System.Text.StringBuilder();
            foreach (var bw in pnlist)
            {
                string delm = sb.Length == 0 ? "" : ",";
                sb.Append(delm);
                sb.Append(bw.GetString());
            }
            sbSP.Append(sb.ToString());
            sbSP.Append("; ");
            string cmdtx = sbSP.ToString();
            CallSqlAzure(cmdtx, conn);
        };
    }

}

public static class SQLUtils
{
    public static string GetString(this GeoCityInfo c)
    {
        GeoCityInfo gdef = new GeoCityInfo();
        var gx = c ?? gdef;
        return string.Format("'{0}','{1}','{2}',{3},{4}",
            gx.City,
            gx.Country,
            gx.Zip,
            gx.Latitude,
            gx.Longitude
            );
    }

    public const string TableNetPingReport = @"(
        id,                  
        UtcTimeStamp,        
        DnsResolveTimeTaken, 
        PingBufferLength,    
        PingRoundTripTime,   
        PingStatus,          
        Host,                
        HostIp,              
        Ip,                  
        Mac, 
        City,
        Country,
        Zip,
        Latitude,
        Longitude                
    )";

    public const string TableBandwidthReport = @"(
        id,
        UtcTimeStamp,
        NetBandwidth,
        DownloadBandwidth,
        Url,
        Ip,
        TcpErrorRate,
        TcpSegmentResendRate,     
        TcpConnResetRate,
        Mac,
        City,
        Country,
        Zip,
        Latitude,
        Longitude                
    )";

    public static string GetString(this NetPingReport r)
    {
        NetPingReport bw = new NetPingReport();
        var bx = r ?? bw;
        return string.Format("('{0}','{1}',{2},{3},{4},'{5}','{6}','{7}','{8}','{9}',{10})",
            bx.id,                        //0
            bx.UtcTimeStamp,              //1
            bx.DnsResolveTimeTaken,       //2
            bx.PingBufferLength,          //3
            bx.PingRoundTripTime,         //4
            bx.PingStatus,                //5
            bx.Host,                      //6
            bx.HostIp,                    //7
            bx.Ip,                        //8
            bx.Mac,                       //9
            bx.City.GetString()           //10
        );
    }

    public static string GetString(this BandwidthReport r)
    {
        BandwidthReport bw = new BandwidthReport();
        var bx = r ?? bw;
        return string.Format("('{0}','{1}',{2},{3},'{4}','{5}',{6},{7},{8},'{9}',{10})",
            bx.id,                         //0
            bx.UtcTimeStamp,               //1
            bx.NetBandwidth,               //2
            bx.DownloadBandwidth,          //3
            bx.Url,                        //4
            bx.Ip,                         //5
            bx.TcpErrorRate,               //6
            bx.TcpSegmentResendRate,       //7
            bx.TcpConnResetRate,           //8
            bx.Mac,                        //9
            bx.City.GetString()            //10
        );
    }

}