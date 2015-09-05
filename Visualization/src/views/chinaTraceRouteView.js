

angular.module('d3Charts')

// D3 Factory
.factory('d3', function() {
    /* We could declare locals or other D3.js
     specific configurations here. */
    return d3;
})

.factory('topojson', function(){
    return topojson;
})


.directive('mChinaTraceRouteView', ["d3", 'eventService', 'topojson',

    function(d3, eventService) {

        var _DrawRouteLines=null;

        eventService.register("search_route", function(route_query){
            // console.log(route_query);
            // alert("selected site: GB1999: " + route_query.gb1999 + ", coOfficeIp: "+ route_query.coOfficeIp +", target: "+ route_query.targetSite);
            _DrawRouteLines(route_query);
        });

        function draw(_width, _height, lineInstances, zoomGB1999, zoomscale ) {

            var width = _width;
            var height = _height;

            // china projection:
            var chinaProjection = d3.geo.mercator()
                .scale(880)
                .rotate([-110,-33.5])
                .translate([width/2,height/2]);

            var zoombehavior = d3.behavior.zoom()
                .scaleExtent([1, 50])
                .on("zoom", panzoom);

            var path = d3.geo.path()
                .projection(chinaProjection)
                .pointRadius(2);

            var svg = d3.select("#svgcounties");
            var gcounties = d3.select('#gcounties').call(zoombehavior);


            function panzoom() {
                var t = d3.event.translate;
                var s = d3.event.scale;
                zoombehavior.translate(t);
                gcounties.style("stroke-width", 1 / s).attr("transform", "translate(" + t + ")scale(" + s + ")");
                gcounties.select('circle').style("r", 3 / s).attr("transform", "translate(" + t + ")scale(" + s + ")");
                d3.selectAll('.site-circle').attr('display', s >= 15 ? 'inline' : 'none');
                // zoom level:
                d3.select("#zoomscale").text(s);
                d3.select("#cx").text(t[0]);
                d3.select("#cy").text(t[1]);
            }

            function DrawCounties(provid)
            {
                d3.selectAll('.province-line').attr('display','inline');
                d3.selectAll('.province-line').attr('style:visibility','visible');
                d3.selectAll('.county-line').attr('style:visibility','visible'); 
                //d3.selectAll('.city-circle').attr('style:visibility','hidden');
                //d3.selectAll('.inactive-of-'+provid).attr('style:visibility','hidden');
                //d3.selectAll('.inactive-of-'+provid).attr('display','none');
                //d3.selectAll('.active-of-'+provid).attr('style:visibility','visible');
                //d3.selectAll('.active-of-'+provid).attr('display','inline');
            }

            function DrawRouteLines(routeQry)
            {
                var siteGB1999 = routeQry.gb1999;
                var siteIP = routeQry.ip;
                var sitelines = GetRouteTrace(routeQry);
                var colorscale= d3.scale.linear().domain([0, 70, 100]).range(["green", "red", "purple"]);

                var gcounties = d3.select('#gcounties');
                d3.selectAll('.instancepath')
                    .remove(); // .attr('style:visibility', 'hidden');

                var sitefrom= chinaProjection(sitelines[0].location);
                gcounties//.selectAll('circle.instancepath')
                    .append("circle")
                    .attr('class', 'instancepath')
                    .attr("cx",  sitefrom[0])
                    .attr("cy",  sitefrom[1])
                    .attr('r', 2)
                    .attr("stroke", 'black') //function(d,i){ return d.color; })
                    .attr('fill','pink');                
                                                            
                gcounties.selectAll('path.route-'+siteGB1999)
                    .data( sitelines )
                    .enter()
                    .append("svg:path")
                    .attr("class", "instancepath route-"+siteGB1999)
                    .attr('style:visibility', 'visible')
                    .attr("d", function(d){
                        return path(arc(d));
                    })
                    .attr("stroke", function(d) {  return colorscale(d.value); } )
                    .sort(function(a, b) { return b.value - a.value; });
                //zoom to country wide
                zoombehavior.translate([0,0]).scale(1).event(gcounties);
                
                d3.selectAll('tr.trtraceleg').remove();
                table = d3.select('#table-site-trace');
                var tr = table.selectAll('tr.trtraceleg')
                    .data(sitelines).enter()
                    .append('tr')
                    .attr('class','trtraceleg')
                    .html(function(m)
                        {
                            var xsrc = FindMatchingGB1999Site(m.source.substring(2));
                            var xdst = FindMatchingGB1999Site(m.target.substring(2));
                            var str= '<td class="cellstart_'+ m.start +'"><p title="12.12.2.21">'+ 
                                    xsrc.FULLNAME+'</p></td>'
                                +'<td class="cellend_'+ m.end+'"><p title="101.12.2.1">'+ xdst.FULLNAME +'</p></td>'+'<td>'+ m.value+'</td>'+'<td>'+ m.step+'</td>';
                            return str;
                        }
                );
                HideToolTip();
            };

            // function to preprocess the user data;
            function LoadUserSiteData(sites) {
                sites = sites.forEach(function(site) {
                    var location = [ site.LON ||site.longitude, site.LAT ||site.latitude];
                    site.location = location; // wrap in geo location
                    var pr =  chinaProjection(site.location);
                    site.cx = pr[0];
                    site.cy = pr[1];
                    //site.radius, site.color
                    SetSiteCircleSizeAndColor(site);
                });
            };


            function DrawChinaMap(geox, sites, fColorForGb1999)
            {
                LoadUserSiteData(sites);

                // draw counties;
                var counties = topojson.feature(geox, geox.objects.county);
                var listofprov = {};

                gcounties.selectAll("path.county-line")
                    .data( counties.features  , function(d,i) { return 'county'+i; } )
                    .enter()
                    .append("svg:path")
                    .attr("d", path)
                    .attr("id", function(d){return "GB"+d.properties.GB1999; })
                    .attr("class", function(d,i) {
                        var clsprv  = 'active-of-'+d.properties.PROVINCE;
                        listofprov [clsprv] = d.properties.PROVINCE;
                        return 'county-line '+ clsprv;
                    })
                    .attr("style:visibility", function(d,i) {
                        return d.properties.PROVINCE==activeProvince? 'visible': 'hidden';
                    })
                    .style('fill', function(d,i) {
                        var colorx = 'white';
                        return colorx;
                    });

                // draw province border line:
                for(var clsx in listofprov)
                {
                    var prvid = listofprov[clsx];
                    var provlines = topojson.merge(geox,
                        geox.objects.county.geometries.filter(
                            function(d) {
                                return d.properties.PROVINCE==prvid;
                            }));
                    provlines["PROVINCE"] =  prvid;
                    gcounties.append('path')
                        .datum(provlines)
                        .attr("class", function(d, i) {
                            var clsprv  = 'inactive-of-'+d.PROVINCE;
                            return 'province-line '+ clsprv;
                        })
                        .attr("d", path)
                        .on("mouseover", function(d, i) {
                            d3.select("#provincename").text('PROVINCE='+d.PROVINCE);
                            DrawCounties(d.PROVINCE);
                        })
                    ;
                }

                // Draw user's data sites by circles;
                gcounties.selectAll("circle.site-circle")
                    .data( sites , function(d,i) { return 'circle'+i; } )
                    .enter()
                    .append("circle")
                    .attr("cx", function(d) {
                        return  d.cx; // projection([d.LON, d.LAT])[0];
                    })
                    .attr("cy", function(d) {
                        return d.cy; // projection([d.LON, d.LAT])[1];
                    })
                    .attr("class", function(d,i){ return 'site-circle'; })
                    .attr("r", function(d,i){ return d.radius; })
                    .attr("stroke", 'black') //function(d,i){ return d.color; })
                    .attr('fill','white')
                    .on("mouseover", function(d){
                        var msg = "<strong>SITEID: "+d.siteid+' '+d.FULLNAME+' '+ d.LAT+' '+ d.LON +"</strong>";
                        d3.select('#txtGB1999').text(d.GB1999);
                        ShowToolTip(msg);
                    })
                    .on("click", function(d){
                        var msg = "<strong>GB1999: "+d.GB1999+d.FULLNAME+' '+ d.LAT+' '+ d.LON +"</strong>";
                        // seleccting the trace route data for a site, we should show the traceroute.
                        //XXXXXXXXXXXXX d3.select('#txtGB1999').attr('value', d.GB1999);
                        var rtqry = { gb1999: d.GB1999, ip: "182.23.12.1" };
                        DrawRouteLines(rtqry);
                    })
                    .sort(function(a, b) { return b.radius - a.radius; });
                

            };


            function zoomToGB1999(zgb1999, zscale)
            {
                gb1999 = zgb1999 || 321281; //jiangsu center
                scalex = zscale || 8;
                var gbsite = FindMatchingGB1999Site(gb1999);
                if (gbsite) {
                    // alert('zooming' + gb1999 + gbsite.FULLNAME + scalex);
                    zoombehavior.translate([width / 2 - gbsite.cx * scalex, height / 2 - gbsite.cy * scalex]).scale(scalex).event(gcounties);
                }
                else{
                    zoombehavior.scale(scalex).event(gcounties);
                }
            }

            this.width = width;
            this.height = height;
            // zoomGB1999 = 320701;
            /*ChinaCountyGBZipLatLonArray as data*/
            // load official GB1999 sites;
            LoadGB1999CountyCenter(ChinaCountyGBZipLatLonArray, chinaProjection);
            // we shall load the site data instead of the government office location,
            // however, we use this just for demo.
            var userSiteMock = co_sites; // ChinaCountyGBZipLatLonArray;
            DrawChinaMap(topoChinaMap, userSiteMock , GetCountyColor );
            zoomToGB1999(zoomGB1999, zoomscale);
            _DrawRouteLines = DrawRouteLines;

            //panzoom to Jiangsu:
            // zoombehavior.scale(7).translate([-800, -200]).event(gcounties);

        };

        return {
            restrict: 'E',
            scope: {
                width:'=',
                height:'=',
                gb1999:'=',
                zoomscale: '=',
                lineInstances: '='
            },
            compile: function( element, attrs, transclude ) {

                // var svg = d3.select(element[0]).append('svg').attr('id','svgcounties');

                // Return the link function
                return function(scope, element, attrs) {
                    draw( scope.width, scope.height, scope.lineInstances, scope.gb1999, scope.zoomscale );
                };
            }
        };
    }
])