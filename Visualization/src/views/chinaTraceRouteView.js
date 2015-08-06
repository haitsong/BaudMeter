
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

        function draw(svg, lineInstances, chinaMap, chinaCityCountyCode) {
            var width = 900, //1200
                height = 600; //800;

            var projection = d3.geo.mercator()
                .scale(880)
                .rotate([-110,-35])
                .translate([0,0]);

            var zoombehavior = d3.behavior.zoom()
                .scaleExtent([1, 10])
                .on("zoom", move);

            var path = d3.geo.path()
                .projection(projection)
                .pointRadius(2);

            var svg = d3.select("body").insert("svg:svg", "h2")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
                .call(zoombehavior);

            var gcounties = svg.append('g') //"svg:g")
                .attr("id", "counties");

            function move() {
                var t = d3.event.translate;
                var s = d3.event.scale;
                t[0] = Math.min(width / 2 * (s - 1), Math.max(width / 2 * (1 - s), t[0]));
                t[1] = Math.min(height / 2 * (s - 1) + 230 * s, Math.max(height / 2 * (1 - s) - 230 * s, t[1]));
                zoombehavior.translate(t);
                gcounties.style("stroke-width", 1 / s).attr("transform", "translate(" + t + ")scale(" + s + ")");
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

            var colorscale= d3.scale.linear().domain([0, 3000, 8000]).range(["green", "yellow", "red"]);

            var activeProvince=32;

            var chinaCountyCityDetail ={};

            function LoadSites(sites) {
                sites = sites.forEach(function(site) {
                    var location = [+site.LON, +site.LAT];
                    site.location = location; // wrap in geo location
                    var pr =  projection(site.location);
                    site.cx = pr[0];
                    site.cy = pr[1];
                    site.GB1999 = site.COUNTY|| site.ZHCITY || site.PROVINCE;
                    // create a map of geo locations;
                    chinaCountyCityDetail[site.GB1999]=site;
                });
            };

            d3.json(chinaMap, function(error, geox)
            {
                // draw counties;
                var counties = topojson.feature(geox, geox.objects.county);
                var listofprov = {};

                gcounties.selectAll("path.county-line")
                    .data( counties.features )
                    .enter()
                    .append("svg:path")
                    .attr("d", path)
                    .attr("class", function(d,i) {
                        var clsprv  = 'active-of-'+d.properties.PROVINCE;
                        listofprov [clsprv] = d.properties.PROVINCE;
                        return 'county-line '+ clsprv;
                    })
                    .on("mouseover", function(d, i) {
                        d3.select("#countyname").text(d.properties.NAME+activeProvince);
                    });

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

            });
        };

        return {
            restrict: 'E',
            scope: {
                lineInstances: '=',
                chinaMap: '=',
                chinaCityCountyCode: '='
            },
            compile: function( element, attrs, transclude ) {

                var svg = d3.select(element[0]).append('svg');

                // Return the link function
                return function(scope, element, attrs) {

                    draw(svg, scope.lineInstances, scope.chinaMap, scope.chinaCityCountyCode);
                };
            }
        };
    }
])