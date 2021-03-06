'use strict';

angular.module('reports').directive('normalPlot', ['D3', '$window',
	function(D3, $window) {
		return {
			restrict: 'EA',
			scope: {
				updateGraph: '='
			},
			link: function postLink(scope, element, attrs) {
				var counter = 0;
			
				D3.d3().then(function(d3) {
					scope.$parent.report.$promise.then(function() {
						
						var project = scope.$parent.report.project;
						var data = [];
						var body = d3.select(element[0]);
						function getData(project,mainCallback) {
								
							var mean = parseFloat(0);
							var stdDe = parseFloat(0);
							
							var minVal = Infinity;
							var maxVal = -Infinity;
							
							var calc = function(inProject,callback){
								console.log(inProject);
								for(var i in inProject.children){
									//console.log(project.children[i])
									var node = inProject.children[i];

									for(var j in node.estimations)
									{	
										//console.log(node.estimations);
										var min = parseInt(node.minestimations[j]);
										var max = parseInt(node.maxestimations[j]);
										var est = parseInt(node.estimations[j]);
										mean = parseFloat(mean) + parseFloat((parseFloat(min) + 4 * parseFloat(est) + parseFloat(max)) / 6);
										stdDe = parseFloat(stdDe) + Math.pow(parseFloat((parseFloat(min) - parseFloat(max)) / 6),2);
										
									}
									mean = mean/node.estimations.length;
								}
								
								stdDe = Math.sqrt(stdDe);
								//console.log(mean);
								//console.log(stdDe);	
								callback();
							};
							
							var dist = function(stdDe,x,mean){
								stdDe = parseFloat(stdDe);
								//console.log(stdDe);
								x = parseFloat(x);
								mean = parseFloat(mean);
								return ( 1 / ( stdDe * Math.sqrt( 2 * Math.PI) ) * Math.pow(Math.E,( -1 * ( Math.pow((x-mean),2) / ( 2 * Math.pow(stdDe,2) ) ) ) ) );
							};
							
							calc(project,function(){
								//console.log(dist(stdDe,90,mean));
								// loop to populate data array with 
								// probabily - quantile pairs
								minVal = parseFloat(mean) - 4*parseFloat(stdDe);
								console.log(mean);
								maxVal = parseFloat(mean) + 4*parseFloat(stdDe);
								//console.log(maxVal);
								//console.log('Min ' + minVal + ' mean ' + mean + ' Max ' + maxVal);
								var tmp = [];
								for (var i = minVal; i <= maxVal; i = i + 0.1) {
									var q = i; // calc random draw from normal dist
									var p = dist(stdDe,i,mean); // calc prob of rand draw
									//console.log(q);
									var el = {
										'q': q,
										'p': p
									};
									tmp.push(el);
								}
								tmp.index = mean;
								tmp.desc = project.name;
								tmp.round = project.round;
								data.push(tmp);
								counter++;
								mainCallback();
								//data.push({'q':mean,'p':1});
							});
									
							
							
							// need to sort for plotting
							//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
							data.sort(function(x, y) {
								return x.q - y.q;
							});	
						}

						var color = d3.scale.category20();
						var getColor =  function(d) {
							
							return color(d.index);
						};
						
						var drawGraph = function(){
							
							body.select('svg').remove();
							
							var margin = {
									top: 20,
									right: 20,
									bottom: 30,
									left: 50
								},
								width = body.node().getBoundingClientRect().width - margin.left - margin.right,
								height = 500 - margin.top - margin.bottom;
							
							var x = d3.scale.linear()
								.range([0, width]);
							
							var y = d3.scale.linear()
								.range([height, 0]);
							
							var xAxis = d3.svg.axis()
								.scale(x)
								.orient('bottom');
							
							var yAxis = d3.svg.axis()
								.scale(y)
								.orient('left');
							
							var line = d3.svg.line()
								.x(function(d) {
									return x(d.q);
								})
								.y(function(d) {
									return y(d.p);
								});
							
							
							
							var svg = d3.select(element[0]).append('svg')
								.attr('width', width + margin.left + margin.right)
								.attr('height', height + margin.top + margin.bottom)
								.append('g')
								.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
							//
							var d3legend = function(g){
								
								g.each(function() {
								var g = d3.select(this),
									items = {},
									svg = d3.select(g.property('nearestViewportElement')),
									legendPadding = g.attr('data-style-padding') || 5,
									lb = g.selectAll('.legend-box').data([true]),
									li = g.selectAll('.legend-items').data([true]);
							
								lb.enter().append('rect').classed('legend-box',true);
								li.enter().append('g').classed('legend-items',true);
							
								svg.selectAll('[data-legend]').each(function() {
									var self = d3.select(this);
									items[self.attr('data-legend')] = {
									pos : self.attr('data-legend-pos') || this.getBBox().y,
									color : self.attr('data-legend-color') ? self.attr('data-legend-color') : self.style('fill') !== 'none' ? self.style('fill') : self.style('stroke') 
									};
								});
							
								items = d3.entries(items).sort(function(a,b) { return a.value.pos-b.value.pos;});
				
								li.selectAll('text')
									.data(items,function(d) { return d.key;})
									.call(function(d) { d.enter().append('text');})
									.call(function(d) { d.exit().remove();})
									.attr('y',function(d,i) { return i+'em';})
									.attr('x','1em')
									.text(function(d) { return d.key;});
								
								li.selectAll('circle')
									.data(items,function(d) { return d.key;})
									.call(function(d) { d.enter().append('circle');})
									.call(function(d) { d.exit().remove();})
									.attr('cy',function(d,i) { return i-0.25+'em';})
									.attr('cx',0)
									.attr('r','0.4em')
									.style('fill',function(d) { return d.value.color;});
								
								// Reposition and resize the box
								var lbbox = li[0][0].getBBox();
								lb.attr('x',(lbbox.x-legendPadding))
									.attr('y',(lbbox.y-legendPadding))
									.attr('height',(lbbox.height+2*legendPadding))
									.attr('width',(lbbox.width+2*legendPadding));
								});
							return g;
							};
							//
							
							var domain = [];
							for(var i in data)
							{
								domain = domain.concat(data[i]);
							}
							
							x.domain(d3.extent(domain, function(d) {
								return d.q;
							}));
							
							y.domain(d3.extent(domain, function(d) {
								return d.p;
							}));
							
							svg.append('g')
								.attr('class', 'x axis')
								.attr('transform', 'translate(0,' + height + ')')
								.call(xAxis);
							
							svg.append('g')
								.attr('class', 'y axis')
								.call(yAxis);
								
							var dist = svg.selectAll('.line')
								.data(data)
								.enter().append('g');
						
							dist.append('path')
								.attr('class', 'line')
								.attr('d', line)
								.attr('stroke',getColor)
								.attr('data-legend',function(d){
									return d.desc +' '+ d.round;
								});
							
							var legend = svg.append('g')
								.attr('class','legend')
								.attr('transform','translate(50,30)')
								.style('font-size','12px')
								.call(d3legend);
						};
						
						getData(project,drawGraph); 
						
						scope.$on('updateGraph',function(event, report){
							//console.log(data);
							console.log(report);
							getData(report.project,drawGraph);
							
							
						});
						
					});
				});
			}
		};
	}
]);