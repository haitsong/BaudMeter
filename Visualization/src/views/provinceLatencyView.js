/* src/chart.js */
// Chart Module 
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

// provinceLatencyView Directive
    .directive('mProvinceLatencyView', ["d3", "eventService", "topojson",
        function(d3, eventService){

            function selectNewCounty(gb1999)
            {
                eventService.publish('selectNewCountyLatency', gb1999);
            }

            var latencyThresholds = [ 1400, 1800, 2000, 2500, 3000, 50000];
            var thresholdColors = ['rgb(253,208,162)','rgb(253,174,107)','rgb(253,141,60)','rgb(241,105,19)','rgb(217,72,1)','rgb(140,45,4)'];
            var color = d3.scale.threshold()
                .domain(latencyThresholds)
                .range(thresholdColors);

            function drawLatencyLabelMark(svg)
            {
                var commasFormatter = d3.format(",.0f")

                var latencyLabel = svg.selectAll(".latencyLabelMark")
                    .data(color.domain())
                    .enter()
                    .append("g")
                    .attr("class","latencyLabelMark");

                latencyLabel.append("rect")
                    .attr("x", 10)
                    .attr("y", function(d,i) { return(i*30) + 400})
                    .attr("width","30px")
                    .attr("height","30px")
                    .attr("fill", function(d) { return color(d) ; })
                    .attr("stroke","#7f7f7f")
                    .attr("stroke-width","0.5");

                latencyLabel.append("text")
                    .attr("class", "legText")
                    .attr("font-size", 10)
                    .attr("font-weight", 400)
                    .text(function(d, i) { return '<= ' + commasFormatter(latencyThresholds[i]) + 'ms'; })
                    .attr("x", 10+35)
                    .attr("y", function(d, i) { return (30 * i) + 400 + 20; })
            }

            function drawDataTypeSelectors(svg){
                var selectors = [
                    { label : '50th percentile', color : '#ef6548'},
                    { label : '75th percentile', color : '#3690c0'},
                    { label : '95th percentile', color : '#41ae76'},
                ];

                var dataTypeSelectors = svg.selectAll('.dataTypeSelectors')
                    .data(selectors)
                    .enter()
                    .append('g')
                    .attr("class","dataTypeSelectors");

                dataTypeSelectors.append("circle")
                    .on("mouseover", function(d){
                        d3.select(this)
                            .classed("percentileSelector_mouseover", true);
                    })
                    .on("mouseout", function(d){
                        d3.select(this).classed("percentileSelector_mouseover", false);
                    })
                    .attr("cx", 25)
                    .attr("cy", function(d,i) {
                        if(i == 0)
                        {
                            d3.select(this).classed("percentileSelector_click", true);
                        }

                        return(i*30) + 250;
                    })
                    .attr("r","12px")
                    .attr("fill", function(d) { return d.color ; });

                dataTypeSelectors.append("text")
                    .attr("font-size", 11)
                    .attr("font-weight", 500)
                    .text(function(d, i) { return d.label; })
                    .attr("x", 25 + 22)
                    .attr("y", function(d, i) { return (30 * i) + 250 + 4; })
            }

            function draw(svg, width, height, latency, provinceMapFile) {

                var path = d3.geo.path();
                var tooltip = d3.select('.tooltip');

                var active_county = null;

                drawLatencyLabelMark(svg);
                drawDataTypeSelectors(svg);

                d3.csv(latency, function(error, latency) {
                    if (error) return console.error(error);
                        console.log(latency);

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
                            .scale(8000)
                            .rotate([center_long, center_lat])		// longitude, latitude of Tai Zhou
                            .translate([width / 1.5, height / 2]);

                        var path = d3.geo.path()
                            .projection(projection);

                        svg.selectAll("path")
                            .data(counties.features)
                            .enter()
                            .append("path")
                            .attr("id", function(d){return "GB"+d.properties.GB1999; })
                            .on("mouseover", function(d){
                                d3.select(this)
                                    .classed("mouse_over_county", true)
                                    .classed("inactive_county", false)
                                    .classed("active_county", false);

                                tooltip.transition()
                                    .duration(500)
                                    .style("opacity", .9);
                                tooltip.html("<strong> County : " + d.properties.NAME +
                                        "<br> <strong>Latency: " + d.properties.value + "ms</strong>" +
                                        "<br> Zip: " + d.properties.ZIP +
                                        "<br> GB1999: " + d.properties.GB1999)
                                    .style("left", (d3.event.pageX) + "px")
                                    .style("top", (d3.event.pageY - 28) + "px");
                            })
                            .on("mouseout", function(d){
                                if("GB"+d.properties.GB1999!=active_county) {
                                    //alert(d.properties.GB1999+active_county);
                                    d3.select(this)
                                        .classed("mouse_over_county", false);
                                        //.classed("inactive_county", true)
                                        //.classed("active_county", false);
                                }
                                else
                                {
                                    d3.select(this)
                                        .classed("mouse_over_county", false)
                                        .classed("active_county", true);
                                }
                                tooltip.transition()
                                    .duration(500)
                                    .style("opacity", 0);
                            })
                            .on("click", function(d){
                                if(active_county) {
                                    d3.select("#" + active_county)
                                        .classed("active_county", false)
                                        .classed("inactive_county", true);
                                }
                                active_county = "GB"+d.properties.GB1999;
                                d3.select(this)
                                    .classed("active_county",true)
                                    .classed("inactive_county",false);

                                selectNewCounty(d.properties.GB1999);
                                eventService.publish("newCountySelection", d.properties.GB1999);
                            })
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

                    var svg = d3.select(element[0]).append('svg').attr('id','province_latency');

                    // Define the dimensions for the chart
                    var width = 700, height = 750;
                    svg.attr('width',width);
                    svg.attr('height',height);

                    // Return the link function
                    return function(scope, element, attrs) {

                        draw(svg, width, height, scope.latency, scope.countyMap);
                    };
                }
            };
        }]);