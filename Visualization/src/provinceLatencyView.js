/* src/chart.js */
// Chart Module 
angular.module('LatencyCharts', [])

// D3 Factory
    .factory('d3', function() {

        /* We could declare locals or other D3.js
         specific configurations here. */

        return d3;
    })

    .factory('topojson', function(){

        return topojson;
    })

// provinceLatencyView Directive
    .directive('mProvinceLatencyView', ["d3", "topojson",
        function(d3){

            function draw(svg, width, height, latency, provinceMapFile) {

                var path = d3.geo.path();

                var color = d3.scale.linear()
                    .range(['rgb(254,229,217)','rgb(252,187,161)','rgb(252,146,114)','rgb(251,106,74)','rgb(239,59,44)','rgb(203,24,29)','rgb(153,0,13)']);

                d3.csv(latency, function(error, latency) {
                    if (error) return console.error(error);
                    console.log(latency);

                    color.domain([
                        //d3.min(latency, function(d) {return d.Latency;} ),
                        0,
                        d3.max(latency, function(d) { return d.Latency;} )
                    ]);

                    // Draw county map with different color for latency.
                    d3.json(provinceMapFile, function(error, geox) {
                        if (error) return console.error(error);

                        var counties = topojson.feature(geox, geox.objects.jiangsu_county);

                        for (var i = 0; i < latency.length; i++) {

                            //Grab zip code
                            var zipCode = latency[i].Zip;

                            //Grab latency value, and convert from string to float
                            var latencyValue = parseFloat(latency[i].Latency);

                            //Find the corresponding state inside the GeoJSON
                            for (var j = 0; j < counties.features.length; j++) {

                                var county_zip = counties.features[j].properties.ZIP;

                                if (zipCode == county_zip) {

                                    //Copy the data value into the JSON
                                    counties.features[j].properties.value = latencyValue;

                                    break;

                                }
                            }
                        }

                        // Choose right projection.
                        /*
                         1. clone d3.js from the github repository.
                         2. edit /d3/examples/albers.html line 53 to point at your GEOJSON file:
                         3. Put the origin long / lat sliders to the center of your country / region (for me, it was 134° / 25°)
                         4. Change the paralells to be as close to the edges of your country / region.
                         5. adjust scale & offset to a nice size & position.

                         */
                        var center_long = -119.923116;
                        var center_lat = -32.455778

                        var projection = d3.geo.mercator()
                            .scale(10000)
                            .rotate([center_long, center_lat])		// longitude, latitude of Tai Zhou
                            .translate([width / 2, height / 2]);

                        var path = d3.geo.path()
                            .projection(projection);

                        svg.selectAll("path")
                            .data(counties.features)
                            .enter()
                            .append("path")
                            .attr("d", path)
                            .attr("class", "county-boundary")
                            .style("fill", function(d){
                                var value = d.properties.value;

                                if (value) {
                                    //If value exists…
                                    return color(value);
                                } else {
                                    //If value is undefined…
                                    return "#ccc";
                                }
                            });

                        // Draw City
                        svg.selectAll("circle1")
                            .data(latency)
                            .enter()
                            .append("circle")
                            .attr("cx", function(d) {
                                return projection([d.Longitude, d.Latitude])[0];
                            })
                            .attr("cy", function(d) {
                                return projection([d.Longitude, d.Latitude])[1];
                            })
                            .attr("r", 1);

                        svg.selectAll("circle2")
                            .data(latency)
                            .enter()
                            .append("circle")
                            .attr("cx", function(d) {
                                return projection([d.Longitude, d.Latitude])[0];
                            })
                            .attr("cy", function(d) {
                                return projection([d.Longitude, d.Latitude])[1];
                            })
                            .attr("r", 2.5)
                            .attr("fill", 'none')
                            .attr('stroke', 'black');

                        svg.selectAll(".place-label")
                            .data(latency)
                            .enter().append("text")
                            .attr("class", "place-label")
                            .attr("transform", function(d) { return "translate(" + projection([d.Longitude, d.Latitude]) + ")"; })
                            .attr("dy", ".80em")
                            .attr("x", function(d) { return d.Longitude > -center_long ? 6 : -6; })
                            .style("text-anchor", function(d) { return d.Longitude > -center_long ? "start" : "end"; })
                            .text(function(d) { return d.County; });
                    });


                });
            }

            return {
                restrict: 'E',
                scope: {
                    latency: '=',
                    countyMap: '='
                },
                compile: function( element, attrs, transclude ) {

                    var svg = d3.select(element[0]).append('svg');

                    // Define the dimensions for the chart
                    var width = 1100, height = 1100;

                    // Return the link function
                    return function(scope, element, attrs) {

                        draw(svg, width, height, scope.latency, scope.countyMap);
                    };
                }
            };
        }]);