/**
 * Created by chi on 5/14/15.
 */
/**
 * Created by chi on 5/10/15.
 */

/*
 * Get Package status(package lost rate) towards given web address
 * Resolve Ip address of given dns domain,
 */


var http = require('http');
var dns = require('dns');
var wp = require('./wping');
var tr = require('./wtrace');
var sites = require('./50website');
var domainlist= sites.TopSites;
var cluster_address = 'baudclustera2.cloudapp.net';
//var watchlist = require('./domain_watch_list');
//var proxy = require('./web_proxy_no_filter');

exports.Initialize = Initialize;

function Initialize(){
    CalculateTrafficStatistic();

    setInterval(CalculateTrafficStatistic, 120000);
}

function Log(message)
{
    console.log(message);
}

function CalculateTrafficStatistic(){


    //var domainlist = watchlist.GetMatchedDomainList();
    //var domainlist = proxy.GetDomainList();
    Log('start to calculate statistic for matched domains ' + JSON.stringify(domainlist));
    Log('current elastic cluster address : ' + cluster_address);

    for(var index in domainlist) {
        Log('domain: ' + domainlist[index]);
        dns.lookup(domainlist[index], function(err, address, family){
            if(!err) {
                PostDomainStatistic(domainlist[index], address);
            }
        });
    }
}

function PostDomainStatistic(domain, address){
    // Test the speed of the connection from proxy to the server(destination of user request), ttl and lost rate.
    // Lost rate is not that accurate.
    wp.probe(address, function(statistic){
        // to do: Post ping result to elastic search.
        Log('ping ' + domain + ':' + address +',' + JSON.stringify(statistic));

        var probe_msg = {
            domain : domain,
            ipAddress : address,
            result : statistic['result'],
            sentPackets: statistic['sentPackets'],
            receivedPackets: statistic['receivedPackets'],
            packetLostRateInPercent: statistic['packetLostRateInPercent'],
            totalTimeInMs: statistic['totalTimeInMs'],
            rttMinInMs: statistic['rttMinInMs'],
            rttAvgInMs: statistic['rttAvgInMs'],
            rttMaxInMs: statistic['rttMaxInMs'],
            rttMdevInMs: statistic['rttMdevInMs']
        }

        postToElasticSearch(JSON.stringify(probe_msg), 'domain_probe', 'probe');
    });

    // Trace how many hops the packet requires to reach the host and how long each hop takes.
    tr.trace(address, function(err, hops){

        if(!err) {
            // to do: Post traceroute result to elastic search.
            Log('traceroute ' + domain + ':' + address + ',' + JSON.stringify(hops));
            var routes = [];
            for (var i = 0; i < hops.length; i++)
                routes.push( JSON.stringify(hops[i]));

            var route_msg = {
                domain : domain,
                ipAddress : address,
                hops: routes
            };

            postToElasticSearch(JSON.stringify(route_msg), 'traffic_route', 'hops');
        }
        else{
            // Post failure ...
        }
    });

}
function postToElasticSearch(content, index, eType){
    var headers = {
        'Content-Type': 'application/json',
        'Content-Length': content.length
    };

    var options = {
        host: cluster_address,
        port: 9200,
        path: '/' + index + '/' + eType,
        method: 'POST',
        headers: headers
    };

    var req = http.request(options, function(res) {
        res.setEncoding('utf-8');

        var responseString = '';

        //Log('start to post to elastic search ' + options.host + eType);

        res.on('data', function(data) {
            responseString += data;
        });

        res.on('end', function() {
            //Log('finish to post to elastic search ' + options.host + eType);
        });
    });

    req.on('error', function(e) {
        Log('fail to post data to ' + options.host + options.path + ', error msg is ' + e);
    });

    req.write(content);
    req.end();
}


//domains = {'www.baidu.com' : true, 'www.google.com': true, 'www.hoopchina.com': true};

//CalculateTrafficStatistic();
//PingDns(domains);
//TraceRoute(domains);

Initialize();

// use:
// node traffic_probe.js