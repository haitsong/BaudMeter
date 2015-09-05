/**
 * Created by chiwan on 8/29/2015.
 */
angular.module('d3Charts')

// D3 Factory
    .factory('d3', function() {

        /* We could declare locals or other D3.js
         specific configurations here. */

        return d3;
    })

    // Listen event on "newCoSelection"
    .directive('mTrafficErrorRateChartView', ["d3", "eventService", "latencyDataService",
        function(d3, eventService, latencyDataService){
            //var width = 1300, height = 300;
            var g_width, g_height;
            var g_chart;

            eventService.register("newCoSelection", update);

            function lineChart(svg_id, width, height) {
                var _chart = {};

                var _width = width, _height = height,
                    _margins = {top: 30, left: 60, right: 70, bottom: 60},
                    _x, _y,
                    _xb, _y1, _y2,
                    _data = [],
                    _qps_data = [],
                    _colors = d3.scale.category10(),
                    _svg,
                    _bodyG,
                    _line;

                _chart.render = function () { // <-2A
                    if (!_svg) {
                        _svg = d3.select("#"+svg_id);

                        renderAxes(_svg);

                        defineBodyClip(_svg);
                    }

                    renderBody(_svg);
                };

                function renderAxes(svg) {
                    var axesG = svg.append("g")
                        .attr("class", "axes");

                    renderXAxis(axesG);

                    renderYAxis(axesG);
                }

                function renderXAxis(axesG){

                    var xAxis = d3.svg.axis()
                        .scale(_xb.range([0, quadrantWidth()]))
                        .orient("bottom")
                        .tickFormat(d3.time.format('%H:%M:%S'))
                        .ticks(10)
                        .tickSubdivide(5);

                    axesG.append("g")
                        .attr("class", "x axis")
                        .attr("transform", function () {
                            return "translate(" + xStart() + "," + yStart() + ")";
                        })
                        .call(xAxis);
                }

                function renderYAxis(axesG){
                    var yAxis = d3.svg.axis()
                        .scale(_y1.range([quadrantHeight(), 0]))
                        .tickFormat(function(d) { return d+'%'})
                        .orient("left");

                    axesG.append("g")
                        .attr("class", "y1 axis")
                        .attr("transform", function () {
                            return "translate(" + xStart() + "," + yEnd() + ")";
                        })
                        .call(yAxis);

                    axesG.append("text")
                        .attr("class", "y1 label")
                        .text("Error Rate")
                        .attr("transform", "rotate(270) translate("+ (-1 * quadrantHeight()/2) + ", 15)")
                    //.attr("font-family", "sans-serif")

                    d3.selectAll("g.y1 g.tick")
                        .append("line")
                        .classed("grid-line", true)
                        .attr("x1", 0)
                        .attr("y1", 0)
                        .attr("x2", quadrantWidth())
                        .attr("y2", 0);
                }

                function defineBodyClip(svg) { // <-2C
                    var padding = 5;

                    svg.append("defs")
                        .append("clipPath")
                        .attr("id", "body-clip")
                        .append("rect")
                        .attr("x", 0 - padding)
                        .attr("y", 0)
                        .attr("width", quadrantWidth() + 2 * padding)
                        .attr("height", quadrantHeight());
                }

                function renderBody(svg) { // <-2D
                    if (!_bodyG)
                        _bodyG = svg.append("g")
                            .attr("class", "body")
                            .attr("transform", "translate("
                            + xStart() + ","
                            + yEnd() + ")") // <-2E
                            .attr("clip-path", "url(#body-clip)");

                    renderLines();

                    renderDots();

                    renderMarkers();
                }

                var x_scale = x = d3.scale.linear()
                    .domain([0, 10])
                    .range([0, quadrantWidth()]);

                var y_scale = d3.scale.linear()
                    .domain([0, 10])
                    .range([quadrantHeight(), 0]);

                function renderLines() {

                    _line = d3.svg.line()
                        .interpolate('cardinal')
                        .x(function (d) {
                            var newX = x_scale(d.x);
                            return newX;
                        })
                        .y(function (d) {
                            var newY = y_scale(d.y);
                            return newY;
                        });

                    _bodyG.selectAll("path.line")
                        .data(_data)
                        .enter() //<-4B
                        .append("path")
                        .style("stroke", function (d, i) {
                            return _colors(i); //<-4C
                        })
                        .attr("class", "line");

                    _bodyG.selectAll("path.line")
                        .data(_data)
                        .transition() //<-4D
                        .attr("d", function (d) {
                            return _line(d);
                        });
                }

                function renderAreas() {
                    var area = d3.svg.area()
                        .interpolate('basis')
                        .x(function(d) { return x_scale(d.x); })
                        .y0(yStart())
                        .y1(function(d) { return y_scale(d.y); });

                    _bodyG.selectAll("path.area")
                        .data(_qps_data)
                        .enter() // <-B
                        .append("path")
                        .style("fill", function (d, i) {
                            return _colors(i);
                        })
                        .attr("class", "area");

                    _bodyG.selectAll("path.area")
                        .data(_qps_data)
                        .transition() // <-D
                        .attr("d", function (d) {
                            return area(d); // <-E
                        });
                }

                function renderDots() {
                    _data.forEach(function (list, i) {
                        _bodyG.selectAll("circle._" + i) //<-4E
                            .data(list)
                            .enter()
                            .append("circle")
                            .attr("class", "dot _" + i);

                        _bodyG.selectAll("circle._" + i)
                            .data(list)
                            .style("stroke", function (d) {
                                return _colors(i); //<-4F
                            })
                            .transition() //<-4G
                            .attr("cx", function (d) { return x_scale(d.x); })
                            .attr("cy", function (d) { return y_scale(d.y); })
                            .attr("r", 4.5);
                    });
                }

                function renderMarkers(){
                    var markers = [
                        { id : 1, name : 'Baidu'},
                        { id : 2, name : 'Weibo'},
                        { id : 3, name : 'WeiXin'},
                        { id : 4, name : 'Taobao'},
                        { id : 5, name : 'Sina'},
                    ];

                    var lineMarkers = _svg.selectAll('.lineMarkers')
                        .data(markers)
                        .enter()
                        .append('g')
                        .attr("class","lineMarkers");

                    lineMarkers.append("rect")
                        .attr("x", function(d, i) { return xStart() + 80 + 80*i; })
                        .attr("y", yStart() + 30)
                        .attr("width", "16px")
                        .attr("height", "5px")
                        .attr("fill", function(d, i) { return _colors(i); });

                    lineMarkers.append("text")
                        .attr("font-size", 11)
                        .attr("font-weight", 500)
                        .text(function(d, i) { return d.name; })
                        .attr("x", function(d, i) { return xStart() + 100 + 80*i; })
                        .attr("y", yStart() + 35)
                        .attr("fill", function(d, i) { return _colors(i); })
                }

                function xStart() {
                    return _margins.left;
                }

                function yStart() {
                    return _height - _margins.bottom;
                }

                function xEnd() {
                    return _width - _margins.right;
                }

                function yEnd() {
                    return _margins.top;
                }

                function quadrantWidth() {
                    return _width - _margins.left - _margins.right;
                }

                function quadrantHeight() {
                    return _height - _margins.top - _margins.bottom;
                }

                _chart.width = function (w) {
                    if (!arguments.length) return _width;
                    _width = w;
                    return _chart;
                };

                _chart.height = function (h) { // <-1C
                    if (!arguments.length) return _height;
                    _height = h;
                    return _chart;
                };

                _chart.margins = function (m) {
                    if (!arguments.length) return _margins;
                    _margins = m;
                    return _chart;
                };

                _chart.colors = function (c) {
                    if (!arguments.length) return _colors;
                    _colors = c;
                    return _chart;
                };

                _chart.x = function (x) {
                    if (!arguments.length) return _x;
                    _x = x;
                    //_x.range(xStart(), xEnd());
                    return _chart;
                };

                _chart.y = function (y) {
                    if (!arguments.length) return _y;
                    _y = y;
                    //_y.range(yStart(), yEnd());
                    return _chart;
                };

                _chart.xb = function (x) {
                    if (!arguments.length) return _xb;
                    _xb = x;
                    return _chart;
                };

                _chart.y1 = function (y) {
                    if (!arguments.length) return _y1;
                    _y1 = y;
                    return _chart;
                };

                _chart.y2 = function (y) {
                    if (!arguments.length) return _y2;
                    _y2 = y;
                    return _chart;
                };

                _chart.addSeries = function (series) { // <-1D
                    _data.push(series);
                    return _chart;
                };

                _chart.addQpsData = function(qps_data){
                    _qps_data.push(qps_data);
                    return _chart;
                }

                return _chart; // <-1E
            }

            function randomData() {
                return Math.random() * 9;
            }

            function update() {
                for (var i = 0; i < data.length; ++i) {
                    var series = data[i];
                    series.length = 0;
                    for (var j = 0; j < numberOfDataPoint; ++j)
                        //series.push({x: j, y: randomData()});
                        series.push({x: j, y: Math.random() * 8 + 1});
                }

                g_chart.render();
            }

            var numberOfSeries = 5,
                numberOfDataPoint = 11,
                data = [];

            function render_chart(svg) {

                for (var i = 0; i < numberOfSeries; ++i)
                    data.push(d3.range(numberOfDataPoint).map(function (i) {
                        //return {x: i, y: randomData()};
                        return {x: i, y: Math.random() * 8 + 1};
                    }));

                var currentDate = new Date();
                var lowDate = new Date(currentDate.getTime() - 15*60000);

                var chart = lineChart('Error_Rate_ChartView_1', g_width, g_height)
                    .x(d3.scale.linear().domain([0, 10]).range(60, g_width-70))
                    .y(d3.scale.linear().domain([0, 10]).range(g_height-30, 30))
                    .xb(d3.time.scale().domain([lowDate, currentDate]))
                    .y1(d3.scale.linear().domain([1.5, 9]))
                    .y2(d3.scale.linear().domain([0,1250]));

                data.forEach(function (series) {
                    chart.addSeries(series);
                });

                chart.addQpsData(d3.range(numberOfDataPoint).map(function (i){
                    return {x: i, y: Math.random() * 5 + 5};
                }));

                g_chart = chart;
                chart.render();
            }

            return {
                restrict: 'E',
                scope: {
                    latency: '=',
                    countyMap: '='
                },
                compile: function( element, attrs, transclude ) {

                    var svg = d3.select(element[0]).append('svg').attr('id','Error_Rate_ChartView_1');

                    // Define the dimensions for the chart

                    var stage_div = d3.select("#ErrorRateChartView1");
                    g_height = stage_div.style("height").replace("px", "");
                    g_width = stage_div.style("width").replace("px", "");
                    var header = d3.select("#ErrorRateChartView1_header");
                    g_height = g_height - header.style("height").replace("px", "") - 30;

                    svg.attr('width',g_width);
                    svg.attr('height',g_height);

                    // Return the link function
                    return function(scope, element, attrs) {
                        //if(!latencyDataService.IsErrorRateInit())
                        //{
                        // clean up global data before redraw.
                            data = [];
                            render_chart(svg);
                        //    latencyDataService.SetErrorRateChartInit(true);
                        //}
                    };
                }
            };
        }]);