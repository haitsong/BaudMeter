/**
 * Pure web proxy, no filtering, no watch_list
 */

var http = require('http');
var net = require('net');
var os = require('os');

var debugging = 0;

var regex_hostport = /^([^:]+)(:([0-9]+))?$/;

var shared_global_objects = {};
shared_global_objects.localIpAddresses = '';
var cluster_address = 'baudclustera2.cloudapp.net';

function Log(message)
{
    console.log(message);
}

function CalculateLocalIpAddress() {
    var ifaces = os.networkInterfaces();

    Object.keys(ifaces).forEach(function (ifname) {
        var alias = 0;

        ifaces[ifname].forEach(function (iface) {
            if ('IPv4' !== iface.family || iface.internal !== false) {
                // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
                return;
            }

            if (alias >= 1) {
                // this single interface has multiple ipv4 addresses
                shared_global_objects.localIpAddresses += ifname + ':' + alias +','+iface.address;
            } else {
                // this interface has only one ipv4 adress
                shared_global_objects.localIpAddresses = ifname + ','+iface.address;
            }
        });
    });
}

function getHostPortFromString( hostString, defaultPort ) {
    var host = hostString;
    var port = defaultPort;

    var result = regex_hostport.exec( hostString );
    if ( result != null ) {
        host = result[1];
        if ( result[2] != null ) {
            port = result[3];
        }
    }

    return( [ host, port ] );
}

function getSubPathFromUrl(url){
    var sub_url = url;
    var regResult = /(.*)(\?)(.*)/.exec( url );
    if ( regResult ) {
        if ( regResult[1].length > 0 ) {
            var lastC = regResult[1].lastIndexOf('/');
            if(lastC > 0) {
                sub_url = regResult[1].substr(0, lastC);
            }
            else{
                sub_url = regResult[1];
            }
        } else {
            sub_url = "/";
        }
    }

    return sub_url;
}

function getPathFromUrl(url) {
    var result = /^[a-zA-Z]+:\/\/[^\/]+(\/.*)?$/.exec(url);
    if (result) {
        if (result[1].length > 0) {
            return result[1];
        } else {
            return "/";
        }
    }

    return "/";
}

// handle a HTTP proxy request
function httpUserRequest( userRequest, userResponse ) {
    if ( debugging ) {
        Log( '  > request: %s', userRequest.url );
    }

    var hostport = getHostPortFromString( userRequest.headers['host'], 80 );

    // have to extract the path from the requested URL
    var path = getPathFromUrl( userRequest.url );
    var b_onList = true;

    if ( debugging ){
        Log('host %s is %s the watchlist', hostport[0], b_onList ? 'on' : 'not on');
    }

    var options = {
        'host': hostport[0],
        'port': hostport[1],
        'method': userRequest.method,
        'path': path,
        'auth': userRequest.auth,
        'headers': userRequest.headers
    };

    if ( debugging ) {
        Log( '  > options: %s', JSON.stringify( options, null, 2 ) );
    }

    var userRequestTime = (new Date()).getTime();
    var firstServerResponseTime;
    var sizeInBytes = 0;
    var proxyRequest = http.request(
        options,
        function ( proxyResponse ) {
            if ( debugging ) {
                Log( '  > request headers: %s', JSON.stringify( options['headers'], null, 2 ) );
            }

            if ( debugging ) {
                Log( '  < response %d headers: %s', proxyResponse.statusCode, JSON.stringify( proxyResponse.headers, null, 2 ) );
            }

            userResponse.writeHead(
                proxyResponse.statusCode,
                proxyResponse.headers
            );

            proxyResponse.on(
                'data',
                function (chunk) {
                    if ( debugging ) {
                        Log('  < chunk = %d bytes', chunk.length);
                    }

                    sizeInBytes += chunk.length;

                    if(b_onList && firstServerResponseTime == undefined) {
                        firstServerResponseTime = (new Date()).getTime();

                        if (debugging){
                            Log(' < data : ' + firstServerResponseTime.toString());
                        }
                    }

                    userResponse.write( chunk );
                }
            );

            proxyResponse.on(
                'end',
                function () {
                    if ( debugging ) {
                        Log( '  < END' );
                    }

                    if(b_onList) {
                        var latencyInMs = firstServerResponseTime - userRequestTime;
                        if (latencyInMs != null || sizeInBytes != 0) {
                            //Log('summary' + ';' + options.host + ';' + options.method + ';' + userRequest.connection.remoteAddress + ';' + latencyInMs + ';' + sizeInBytes);

                            var sub_url = getSubPathFromUrl(options.path);

                            var msg = {
                                domain: options.host,
                                httpVerb: options.method,
                                clientIp: userRequest.connection.remoteAddress,
                                proxyIp: shared_global_objects.localIpAddresses,
                                latencyMs: latencyInMs,
                                payloadBytes: sizeInBytes,
                                agent: options.headers['user-agent'],
                                contentType: proxyResponse.headers['content-type'],
                                statusCode: proxyResponse.statusCode,
                                message: 'OK',
                                path: sub_url
                            };

                            var msgStr = JSON.stringify(msg);
                            if(debugging) {
                                Log('Json obj : ' + msgStr);
                            }

                            postMsgToElasticSearch(msgStr);
                        }
                    }

                    userResponse.end();
                }
            );
        }
    );

    proxyRequest.on(
        'error',
        function ( error ) {
            userResponse.writeHead( 500 );
            userResponse.write(
                "<h1>500 Error</h1>\r\n" +
                "<p>Error was <pre>" + error + "</pre></p>\r\n" +
                "</body></html>\r\n"
            );

            if(b_onList) {
                var msg = {
                    domain: options.host,
                    httpVerb: options.method,
                    clientIp: userRequest.connection.remoteAddress,
                    proxyIp: shared_global_objects.localIpAddresses,
                    agent: options.headers['user-agent'],
                    contentType: userRequest.headers['accept'],
                    statusCode: error.statusCode,
                    message: error.message,
                    path: getSubPathFromUrl(options.path)
                };

                var msgStr = JSON.stringify(msg);
                if(debugging) {
                    Log('Json obj : ' + msgStr);
                }

                postMsgToElasticSearch(msgStr);
            }

            userResponse.end();
        }
    );

    userRequest.addListener(
        'data',
        function (chunk) {
            if ( debugging ) {
                Log( '  > chunk = %d bytes', chunk.length );
            }
            proxyRequest.write( chunk );
        }
    );

    userRequest.addListener(
        'end',
        function () {
            proxyRequest.end();
        }
    );
}

function postMsgToElasticSearch(content){
    var headers = {
        'Content-Type': 'application/json',
        'Content-Length': content.length
    };

    var options = {
        host: cluster_address,
        port: 9200,
        path: '/proxy_log/user_request',
        method: 'POST',
        headers: headers
    };

    var req = http.request(options, function(res) {
        res.setEncoding('utf-8');

        var responseString = '';

        Log('start to post to elastic search ' + options.host);

        res.on('data', function(data) {
            responseString += data;
        });

        res.on('end', function() {
            Log('finish to post to elastic search ' + options.host);
        });
    });

    req.on('error', function(e) {
        Log('fail to post data to ' + options.host + options.path + ', error msg is ' + e);
    });

    req.write(content);
    req.end();
}

function main() {
    var port = 5555; // default port if none on command line

    CalculateLocalIpAddress();

    // check for any command line arguments
    for ( var argn = 2; argn < process.argv.length; argn++ ) {
        if ( process.argv[argn] === '-p' ) {
            port = parseInt( process.argv[argn + 1] );
            argn++;
            continue;
        }

        if ( process.argv[argn] === '-d' ) {
            debugging = 1;
        }
    }

    if ( debugging ) {
        Log( 'server listening on port ' + port );
    }

    // start HTTP server with custom request handler callback function
    var server = http.createServer( httpUserRequest ).listen(port);

    // add handler for HTTPS (which issues a CONNECT to the proxy)
    server.addListener(
        'connect',
        function ( request, socketRequest, bodyhead ) {
            var url = request['url'];
            var httpVersion = request['httpVersion'];

            var hostport = getHostPortFromString( url, 443 );

            if ( debugging )
                Log( '  = will connect to %s:%s', hostport[0], hostport[1] );

            // set up TCP connection
            var proxySocket = new net.Socket();
            proxySocket.connect(
                parseInt( hostport[1] ), hostport[0],
                function () {
                    if ( debugging )
                        Log( '  < connected to %s/%s', hostport[0], hostport[1] );

                    if ( debugging )
                        Log( '  > writing head of length %d', bodyhead.length );

                    proxySocket.write( bodyhead );

                    // tell the caller the connection was successfully established
                    socketRequest.write( "HTTP/" + httpVersion + " 200 Connection established\r\n\r\n" );
                }
            );

            proxySocket.on(
                'data',
                function ( chunk ) {
                    if ( debugging )
                        Log( '  < data length = %d', chunk.length );

                    socketRequest.write( chunk );
                }
            );

            proxySocket.on(
                'end',
                function () {
                    if ( debugging )
                        Log( '  < end' );

                    socketRequest.end();
                }
            );

            socketRequest.on(
                'data',
                function ( chunk ) {
                    if ( debugging )
                        Log( '  > data length = %d', chunk.length );

                    proxySocket.write( chunk );
                }
            );

            socketRequest.on(
                'end',
                function () {
                    if ( debugging )
                        Log( '  > end' );

                    proxySocket.end();
                }
            );

            proxySocket.on(
                'error',
                function ( err ) {
                    socketRequest.write( "HTTP/" + httpVersion + " 500 Connection error\r\n\r\n" );
                    if ( debugging ) {
                        Log( '  < ERR: %s', err );
                    }
                    socketRequest.end();
                }
            );

            socketRequest.on(
                'error',
                function ( err ) {
                    if ( debugging ) {
                        Log( '  > ERR: %s', err );
                    }
                    proxySocket.end();
                }
            );
        }
    ); // HTTPS connect listener
}

main();