/**
 * Created by chiwan on 8/28/2015.
 */
/**
 * Created by chiwan on 8/28/2015.
 */
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

    .directive('mTrafficContributionView', ["d3", "eventService", "topojson",
        function(d3, eventService){

            var g_svg;
            var currentDataSetIndex = 1;
            var traffic_datas = [
                {
                "name": "traffic",
                "children": [
                    {
                        "name": "Hao123", "value" : 240,
                        "children": [
                            {"name": "Img/Mobile", "value": 15},
                            {"name": "Text/Mobile", "value": 70},
                            {"name": "Img/Desktop", "value": 400},
                            {"name": "Text/Desktop", "value": 500}
                            ]
                    },
                    {
                        "name": "Taobao", "value" : 6000,
                        "children": [
                            {"name": "Img/Mobile", "value": 1500},
                            {"name": "Text/Mobile", "value": 1000},
                            {"name": "Stream/Mobile", "value": 70},
                            {"name": "Stream/Desktop", "value": 70},
                            {"name": "Img/Desktop", "value": 2000},
                            {"name": "Text/Desktop", "value": 3000}
                        ]
                    },
                    {
                        "name": "Baidu", "value" : 8000,
                        "children": [
                            {"name": "Img/Mobile", "value": 4000},
                            {"name": "Text/Mobile", "value": 3000},
                            {"name": "Stream/Mobile", "value": 200},
                            {"name": "Stream/Desktop", "value": 150},
                            {"name": "Img/Desktop", "value": 3000},
                            {"name": "Text/Desktop", "value": 4000}
                        ]
                    },
                    {
                        "name": "Weibo", "value" : 5400,
                        "children": [
                            {"name": "Img/Mobile", "value": 7000},
                            {"name": "Text/Mobile", "value": 9000},
                            {"name": "Stream/Mobile", "value": 6000},
                            {"name": "Stream/Desktop", "value": 600},
                            {"name": "Img/Desktop", "value": 500},
                            {"name": "Text/Desktop", "value": 400}
                        ]
                    },
                    {
                        "name": "360", "value" : 200,
                        "children": [
                            {"name": "Img/Mobile", "value": 70},
                            {"name": "Text/Mobile", "value": 400},
                            {"name": "Stream/Mobile", "value": 70},
                            {"name": "Stream/Desktop", "value": 900},
                            {"name": "Img/Desktop", "value": 70},
                            {"name": "Text/Desktop", "value": 150}
                        ]
                    },
                    {
                        "name": "QQ", "value" : 6500,
                        "children": [
                            {"name": "Img/Mobile", "value": 2000},
                            {"name": "Text/Mobile", "value": 500},
                            {"name": "Img/Desktop", "value": 500},
                            {"name": "Text/Desktop", "value": 600}
                        ]
                    },
                    {
                        "name": "Tmall", "value" : 2400,
                        "children": [
                            {"name": "Img/Mobile", "value": 70},
                            {"name": "Text/Mobile", "value": 700},
                            {"name": "Stream/Mobile", "value": 70},
                            {"name": "Img/Desktop", "value": 7000},
                            {"name": "Text/Desktop", "value": 4000}
                        ]
                    },
                    {
                        "name": "Tianya", "value" : 900,
                        "children": [
                            {"name": "Img/Mobile", "value": 140},
                            {"name": "Text/Mobile", "value": 500},
                            {"name": "Stream/Mobile", "value": 70},
                            {"name": "Stream/Desktop", "value": 70},
                            {"name": "Img/Desktop", "value": 70},
                            {"name": "Text/Desktop", "value": 600}
                        ]
                    },
                    {
                        "name": "Sohu", "value" : 900,
                        "children": [
                            {"name": "Img/Mobile", "value": 70},
                            {"name": "Text/Mobile", "value": 200},
                            {"name": "Stream/Mobile", "value": 70},
                            {"name": "Stream/Desktop", "value": 600},
                            {"name": "Img/Desktop", "value": 400},
                            {"name": "Text/Desktop", "value": 70}
                        ]
                    },
                    {
                        "name": "Sina", "value" : 5500,
                        "children": [
                            {"name": "Img/Mobile", "value": 1000},
                            {"name": "Text/Mobile", "value": 450},
                            {"name": "Stream/Desktop", "value": 70},
                            {"name": "Img/Desktop", "value": 70},
                            {"name": "Text/Desktop", "value": 3000}
                        ]
                    }

                ]
            },
                {
                    "name": "traffic",
                    "children": [
                        {
                            "name": "Hao123", "value" : 240,
                            "children": [
                                {"name": "Img/Mobile", "value": 15},
                                {"name": "Text/Mobile", "value": 70},
                                {"name": "Img/Desktop", "value": 400},
                                {"name": "Text/Desktop", "value": 500}
                            ]
                        },
                        {
                            "name": "Taobao", "value" : 10000,
                            "children": [
                                {"name": "Img/Mobile", "value": 1500},
                                {"name": "Text/Mobile", "value": 8000},
                                {"name": "Stream/Mobile", "value": 70},
                                {"name": "Stream/Desktop", "value": 70},
                                {"name": "Img/Desktop", "value": 12000},
                                {"name": "Text/Desktop", "value": 14000}
                            ]
                        },
                        {
                            "name": "Baidu", "value" : 1600,
                            "children": [
                                {"name": "Img/Mobile", "value": 1300},
                                {"name": "Text/Mobile", "value": 3000},
                                {"name": "Stream/Mobile", "value": 200},
                                {"name": "Stream/Desktop", "value": 150},
                                {"name": "Img/Desktop", "value": 600},
                                {"name": "Text/Desktop", "value": 400}
                            ]
                        },
                        {
                            "name": "Weibo", "value" : 600,
                            "children": [
                                {"name": "Img/Mobile", "value": 400},
                                {"name": "Text/Mobile", "value": 2000},
                                {"name": "Stream/Mobile", "value": 1700},
                                {"name": "Stream/Desktop", "value": 600},
                                {"name": "Img/Desktop", "value": 500},
                                {"name": "Text/Desktop", "value": 400}
                            ]
                        },
                        {
                            "name": "360", "value" : 200,
                            "children": [
                                {"name": "Img/Mobile", "value": 70},
                                {"name": "Text/Mobile", "value": 400},
                                {"name": "Stream/Mobile", "value": 70},
                                {"name": "Stream/Desktop", "value": 900},
                                {"name": "Img/Desktop", "value": 70},
                                {"name": "Text/Desktop", "value": 150}
                            ]
                        },
                        {
                            "name": "QQ", "value" : 6500,
                            "children": [
                                {"name": "Img/Mobile", "value": 2000},
                                {"name": "Text/Mobile", "value": 500},
                                {"name": "Img/Desktop", "value": 500},
                                {"name": "Text/Desktop", "value": 600}
                            ]
                        },
                        {
                            "name": "Tmall", "value" : 600,
                            "children": [
                                {"name": "Img/Mobile", "value": 70},
                                {"name": "Text/Mobile", "value": 3000},
                                {"name": "Stream/Mobile", "value": 70},
                                {"name": "Img/Desktop", "value": 700},
                                {"name": "Text/Desktop", "value": 4000}
                            ]
                        },
                        {
                            "name": "Tianya", "value" : 900,
                            "children": [
                                {"name": "Img/Mobile", "value": 140},
                                {"name": "Text/Mobile", "value": 500},
                                {"name": "Stream/Mobile", "value": 70},
                                {"name": "Stream/Desktop", "value": 70},
                                {"name": "Img/Desktop", "value": 70},
                                {"name": "Text/Desktop", "value": 600}
                            ]
                        },
                        {
                            "name": "Sohu", "value" : 900,
                            "children": [
                                {"name": "Img/Mobile", "value": 70},
                                {"name": "Text/Mobile", "value": 200},
                                {"name": "Stream/Mobile", "value": 70},
                                {"name": "Stream/Desktop", "value": 600},
                                {"name": "Img/Desktop", "value": 400},
                                {"name": "Text/Desktop", "value": 70}
                            ]
                        },
                        {
                            "name": "Sina", "value" : 5500,
                            "children": [
                                {"name": "Img/Mobile", "value": 1000},
                                {"name": "Text/Mobile", "value": 450},
                                {"name": "Stream/Desktop", "value": 70},
                                {"name": "Img/Desktop", "value": 70},
                                {"name": "Text/Desktop", "value": 3000}
                            ]
                        }

                    ]
                }
            ];

            var width = 530, height = 530;

            eventService.register("newCoSelection", update);

            var color_pick = d3.scale.ordinal()
                .range(['#EF3B39', '#FFCD05', '#69C9CA', '#666699', '#CC3366', '#0099CC',
                    '#CCCB31', '#009966', '#C1272D', '#F79420', '#445CA9', '#999999',
                    '#402312', '#272361', '#A67C52', '#016735', '#F1AAAF', '#FBF5A2',
                    '#A0E6DA', '#C9A8E2', '#F190AC', '#7BD2EA', '#DBD6B6', '#6FE4D0']);

            var arc_tickAngle = function (d) {
                var midAngle = (d.endAngle-d.startAngle)/2,
                    degrees = (midAngle+d.startAngle)/Math.PI*180-90;

                return degrees;
            };

            var arc_labels = function (text, radius) {
                return function (selection) {
                    selection.append('text')
                        .text(text)
                        .attr('text-anchor', function (d) {
                            return arc_tickAngle(d) > 100 ? 'end' : 'start';
                        })
                        .attr('transform', function (d) {
                            var degrees = arc_tickAngle(d);

                            var turn = 'rotate('+degrees+') translate('+(radius(d)+7)+', 0)';

                            if (degrees > 100) {
                                turn += 'rotate(180)';
                            }

                            return turn;
                        });
                };
            };

            var arc_tooltip = function (svg, text) {

                return function (selection) {
                    selection.on('mouseover.tooltip', mouseover)
                        .on('mousemove.tooltip', mousemove)
                        .on('mouseout.tooltip', mouseout);

                    function mouseover(d) {
                        var path = d3.select(this);
                        path.classed('highlighted', true);

                        var mouse = d3.mouse(svg.node());

                        var tool = svg.append('g')
                            .attr({'id': "nicktool",
                                transform: 'translate('+(mouse[0]+5)+', '+(mouse[1]+10)+')'});

                        var textNode = tool.append('text')
                            .text(text(d)).node();

                        tool.append('rect')
                            .attr({height: textNode.getBBox().height,
                                width: textNode.getBBox().width,
                                transform: 'translate(0, -16)'});

                        tool.select('text')
                            .remove();

                        tool.append('text')
                            .text(text(d));
                    }

                    function mousemove () {
                        var mouse = d3.mouse(svg.node());
                        d3.select('#nicktool')
                            .attr('transform', 'translate('+(mouse[0]+15)+', '+(mouse[1]+20)+')');
                    }

                    function mouseout () {
                        var path = d3.select(this);
                        path.classed('highlighted', false);

                        d3.select('#nicktool').remove();
                    }
                };
            };

            var arc_main_label = function renderLabels(text, radious) {

                return function (selection) {
                    selection.append('text')
                        .text(text)
                        .attr("fill","white")
                        .attr("font-size", 12)
                        .attr("stroke", "white")
                        .attr("stroke-width", 1)
                        .attr("text-anchor", "middle")
                        .attr('transform', function (d) {
                            var degrees = arc_tickAngle(d);

                            var turn = 'rotate('+degrees+') translate('+(radious(d) - 27)+', 0)';

                            if (degrees > 100) {
                                turn += 'rotate(180)';
                            }

                            return turn;
                        });
                };
            }

            function draw(svg){
                render(svg);
            }

            function update(){
                if(currentDataSetIndex > 0)
                    currentDataSetIndex = 0;
                else
                    currentDataSetIndex = 1;

                render(g_svg);
            }

            function render(svg){

                var texts = svg.selectAll('text').remove();

                var partition = d3.layout.partition()
                    .value(function (d) { return d.value; })
                    .sort(function (a, b) {
                        return d3.descending(a.value, b.value);
                    })
                    .size([2*Math.PI, 200]);

                var nodes = partition.nodes(traffic_datas[currentDataSetIndex]);

                var arc = d3.svg.arc()
                    .innerRadius(function (d) { return d.y; })
                    .outerRadius(function (d) { return d.depth ? d.y+d.dy/d.depth : 0; });

                nodes = nodes.map(function (d) {
                    d.startAngle = d.x;
                    d.endAngle = d.x+d.dx;
                    return d;
                });

                nodes = nodes.filter(function (d) { return d.depth; });

                var chart = svg.append('g')
                    .attr('transform', 'translate('+width/2+','+height/2+')');

                var node = chart.selectAll('g')
                    .data(nodes)
                    .enter()
                    .append('g');

                node.append('path')
                    .attr({d: arc, fill: function (d) { return color_pick(d.name); }});


                node.filter(function (d) {
                    return d.depth > 1 && d.value > 1500; })
                    .call(arc_labels(function (d) {
                            return d.name;
                        },
                        arc.outerRadius()));

                node.filter(function (d){ return d.depth == 1; })
                    .call(arc_main_label(function(d){return d.name;}, arc.outerRadius()));

                node.call(arc_tooltip(svg, function (d) { return d.name; }));
            }

            return {
                restrict: 'E',
                scope: {
                    latency: '=',
                    countyMap: '='
                },
                compile: function( element, attrs, transclude ) {

                    var svg = d3.select(element[0]).append('svg').attr('id','traffic_contribution_pie');

                    // Define the dimensions for the chart

                    svg.attr('width',width);
                    svg.attr('height',height);
                    g_svg = svg;

                    // Return the link function
                    return function(scope, element, attrs) {
                        draw(svg);
                    };
                }
            };
        }]);