

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
            //console.log(route_query);
            alert("selected site: GB1999: " + route_query.gb1999 + ", coOfficeIp: "+ route_query.coOfficeIp +", target: "+ route_query.targetSite);
            _DrawRouteLines(route_query);
        });

        function draw(_width, _height, lineInstances, zoomGB1999, zoomscale ) {

            var width = _width;
            var height = _height;

            // china projection:
            var chinaProjection = d3.geo.mercator()
                .scale(880)
                .rotate([-110,-35])
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
                d3.selectAll('.county-line').attr('style:visibility','hidden');
                d3.selectAll('.city-circle').attr('style:visibility','hidden');
                d3.selectAll('.inactive-of-'+provid).attr('style:visibility','hidden');
                d3.selectAll('.inactive-of-'+provid).attr('display','none');
                d3.selectAll('.active-of-'+provid).attr('style:visibility','visible');
                d3.selectAll('.active-of-'+provid).attr('display','inline');
            }

            function DrawRouteLines(routeQry)
            {
                var siteGB1999 = routeQry.gb1999;
                var siteIP = routeQry.ip;
                var sitelines = GetRouteTrace(routeQry);
                var colorscale= d3.scale.linear().domain([0, 30, 100]).range(["green", "yellow", "red"]);

                var gcounties = d3.select('#gcounties');
                gcounties.selectAll("path.instancepath")
                    .data( sitelines )
                    .enter()
                    .append("svg:path")
                    .attr("class", "instancepath route-"+siteGB1999)
                    .attr("d", function(d){
                        return path(arc(d));
                    })
                    .attr("stroke", function(d) {  return  colorscale(d.value); } )
                    .sort(function(a, b) { return b.value - a.value; });
                //zoom to country wide
                zoombehavior.translate([0,0]).scale(1).event(gcounties);
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
                        var colorx = d.properties.PROVINCE==0? '#4169E1':
                            fColorForGb1999(d.properties.GB1999);
                        return colorx;
                    })
                    .on("mouseover", function(d){
                        d3.select("#countyname").text(d.properties.NAME+activeProvince);
                        d3.select(this)
                            .classed("mouseover-county-line", true)
                            .classed("active-county-line", false);
                        ShowToolTip("<strong>GB1999: " + d.properties.GB1999+"</strong>");
                    })
                    .on("mouseout", function(d){
                            d3.select(this)
                                .classed("mouseover-county-line", false)
                                .classed("active-county-line", "GB"+d.properties.GB1999==active_county );
                        HideToolTip();
                    })
                    .on("click", function(d){
                        if(active_county) {
                            d3.select("#" + active_county)
                                .classed("active-county-line", false);
                        }
                        active_county = "GB"+d.properties.GB1999;
                        d3.select(this)
                            .classed("active-county-line",true);
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
                    .on("mouseover", function(d){
                        var msg = "<strong>GB1999: "+d.GB1999+d.FULLNAME+' '+ d.LAT+' '+ d.LON +"</strong>";
                        ShowToolTip(msg);
                    })
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
            var userSiteMock = ChinaCountyGBZipLatLonArray;
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
                // Return the link function
                return function(scope, element, attrs) {
                    draw( scope.width, scope.height, scope.lineInstances, scope.gb1999, scope.zoomscale );
                };
            }
        };
    }
])