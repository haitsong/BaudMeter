
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

        eventService.register("search_route", function(route_query){
            //console.log(route_query);
            alert("GB1999: " + route_query.gb1999 + ", coOfficeIp: "+ route_query.coOfficeIp +", target: "+ route_query.targetSite);
        });

        function draw(width, height, lineInstances, zoomGB1999, zoomscale) {

            // china projection:
            var projection = d3.geo.mercator()
                .scale(880)
                .rotate([-110,-35])
                // .translate([0,0]);
                .translate([width/2,height/2]);

            var zoombehavior = d3.behavior.zoom()
                .scaleExtent([1, 50])
                .on("zoom", panzoom);

            var path = d3.geo.path()
                .projection(projection)
                .pointRadius(2);

            var svg = d3.select("#svgcounties");

            var gcounties = d3.select('#gcounties')
                // .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
                .call(zoombehavior);

            function panzoom() {
                var t = d3.event.translate;
                var s = d3.event.scale;
                // t[0] = Math.min(width / 2 * (s - 1), Math.max(width / 2 * (1 - s), t[0]));
                // t[1] = Math.min(height / 2 * (s - 1) + 230 * s, Math.max(height / 2 * (1 - s) - 230 * s, t[1]));
                zoombehavior.translate(t);
                gcounties.style("stroke-width", 1 / s).attr("transform", "translate(" + t + ")scale(" + s + ")");
                gcounties.select('circle').style("r", 3/s).attr("transform", "translate(" + t + ")scale(" + s + ")");
                // zoom level:
                d3.select("#zoomscale").text(s);
                d3.select("#cx").text(t[0]);
                d3.select("#cy").text(t[1]);
                if(s>=15)
                {
                    d3.selectAll('.site-circle').attr('display','inline');
                }
                else
                {
                    d3.selectAll('.site-circle').attr('display','none');
                }
            }

            function DrawCounties(provid)
            {
                d3.selectAll('.province-line').attr('display','inline');
                d3.selectAll('.province-line').attr('style:visibility','visible');
                d3.selectAll('.county-line').attr('style:visibility','hidden');
                d3.selectAll('.city-circle').attr('style:visibility','hidden');
                d3.selectAll('.inactive-of-'+provid).attr('style:visibility','hidden');
                d3.selectAll('.inactive-of-'+provid).attr('display','none');
                d3.selectAll('.active-of-'+provid).attr('style:visibility','visible');
                d3.selectAll('.active-of-'+provid).attr('display','inline');
            }

            /* INPUT PARAMETER, a function to return color for gb1999 */
            function GetCountyColor( gb1999OfCounty )
            {
                var colors  = ['#8ef','#fe8','#b8e','#8eb','#be8','#fbc','#cbf','#d8e','#e8d','#de8'];
                return colors[Math.floor(gb1999OfCounty/100%11)];
            }

            function SetSiteCircleSizeAndColor(site)
            {
                var code= site.GB1999;
                var colorscale= d3.scale.linear().domain([0, 7000, 8000]).range(["green", "yellow", "red"]);
                site.color = colorscale(code%7*1000);
                site.radius = (code%11)*0.3;
            }

            var activeProvince=0;

            var chinaCountyCityDetail ={};
            function LoadGB1999CountyCenter(sites) {
                sites = sites.forEach(function(site) {
                    var location = [ site.LON ||site.longitude, site.LAT ||site.latitude];
                    site.location = location; // wrap in geo location
                    var pr =  projection(site.location);
                    site.cx = pr[0];
                    site.cy = pr[1];
                    if(!site.GB1999)
                    {   // GB1999 should be computed before hand so that we know
                        // what it belongs to.
                        site.GB1999 = site.COUNTY|| site.ZHCITY || site.PROVINCE;
                    }
                    // create a map of geo locations;
                    chinaCountyCityDetail["GB"+site.GB1999]=site;
                });
            };

            // load official GB1999 sites;
            LoadGB1999CountyCenter(ChinaCountyGBZipLatLonArray);

            function FindMatchingGB1999Site(gb1999, nullallowed)
            {
                var s = "GB"+gb1999;
                var res = chinaCountyCityDetail[s];
                if(res || nullallowed)
                {
                    return res;
                }
                return FindMatchingGB1999Site( Math.floor(gb1999/100.0) *100, true );
            }

            // function to preprocess the user data;
            function LoadUserSiteData(sites) {
                sites = sites.forEach(function(site) {
                    var location = [ site.LON ||site.longitude, site.LAT ||site.latitude];
                    site.location = location; // wrap in geo location
                    var pr =  projection(site.location);
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
                    .attr("class", function(d,i) {
                        var clsprv  = 'active-of-'+d.properties.PROVINCE;
                        listofprov [clsprv] = d.properties.PROVINCE;
                        return 'county-line '+ clsprv;
                    })
                    .attr("style:visibility", function(d,i) {
                        return d.properties.PROVINCE==activeProvince? 'visible': 'hidden';
                    })
                    .style('fill', function(d,i) {
                        var colorx = d.properties.PROVINCE==0? '#4169E1': fColorForGb1999(d.properties.GB1999);
                        return colorx;
                    })
                    .on("mouseover", function(d, i) {
                        d3.select("#countyname").text(d.properties.NAME+activeProvince);
                    });

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
                    .attr("fill", function(d,i){ return d.color; })
                    .on("click", function(d){ alert(d.GB1999+d.FULLNAME );})
                    .sort(function(a, b) { return b.radius - a.radius; });

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


            };

            function zoomToGB1999(zgb1999, zscale)
            {
                gb1999 = zgb1999 || 320701;
                scalex = zscale || 10;
                var gbsite = FindMatchingGB1999Site(gb1999);
                if (gbsite) {
                    alert('zooming' + gb1999 + gbsite.FULLNAME + scalex);
                    zoombehavior.translate([width / 2 - gbsite.cx * scalex, height / 2 - gbsite.cy * scalex]).scale(scalex).event(gcounties);
                }
                else{
                    zoombehavior.scale(scalex).event(gcounties);
                }
            }

            // zoomGB1999 = 320701;
            /*ChinaCountyGBZipLatLonArray as data*/
            DrawChinaMap(topoChinaMap, ChinaCountyGBZipLatLonArray, GetCountyColor );
            zoomToGB1999(zoomGB1999, zoomscale);

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
                // Return the link function
                return function(scope, element, attrs) {
                    draw( scope.width, scope.height, scope.lineInstances, scope.gb1999, scope.zoomscale);
                };
            }
        };
    }
])