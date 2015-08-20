'use strict';

angular.module('reports').directive('boxPlot', ['D3', '$window',
	function(D3, $window) {
		return {
			restrict : 'EA',
			scope : {},
			link : function(scope, element, attrs) {
				D3.d3().then(function(d3) {
					scope.$parent.report.$promise.then(function() {
						var project = scope.$parent.report.project;
						// d3 is the raw d3 object
						var body = d3.select(element[0]).append('p');
						//.attr('width', 50)
						//.attr('height', 50);
						//d3.select("body").node().getBoundingClientRect().width
						var bodyWidth = body.node().getBoundingClientRect().width;
						var bodyHeight = 30;
						var body = d3.select(element[0]);
						body.append('p').text('Your Report..');

						var createBox = function(_range, _minOutlier, _minStdDeviation, _median, _maxStdDeviation, _maxOutlier) {
							var strokeWidth = 2;
							var bar = body.append('svg')
							.attr('width', bodyWidth + strokeWidth)
							.attr('height', bodyHeight + strokeWidth);

							var svg = body.append('svg')
							.attr('width', bodyWidth + strokeWidth)
							.attr('height', bodyHeight + strokeWidth);

							var middleHeight = (bodyHeight / 2);
							var middleWidht = (bodyWidth / 2);
							var range = _range;
							var ratio = parseInt(bodyWidth / range);
							var strokeWidth = 2;
							var minOutlier = _minOutlier * ratio;
							var minStdDeviation = _minStdDeviation * ratio;
							var median = _median * ratio;
							var maxStdDeviation = _maxStdDeviation * ratio;
							var maxOutlier = _maxOutlier * ratio;
							/*
							Creating the left line
							*/
							svg.append('line')
							.attr('x1', 0 + minOutlier)
							.attr('y1', middleHeight)
							.attr('x2', maxOutlier)
							.attr('y2', middleHeight)
							.style('stroke', 'black')
							.style('stroke-dasharray', ('3, 3'));

							var boxWidth = 200;
							var boxHeight = bodyHeight - strokeWidth;
							/*
							Creating the first wisker
							*/
							var boxUpDownLength = boxHeight / 2;
							svg.append('line')
							.attr('x1', minOutlier)
							.attr('y1', middleHeight + boxUpDownLength)
							.attr('x2', minOutlier)
							.attr('y2', middleHeight - boxUpDownLength)
							.style('stroke', 'black');

							/*
							Creating the second wisker
							*/
							svg.append('line')
							.attr('x1', maxOutlier)
							.attr('y1', middleHeight + boxUpDownLength)
							.attr('x2', maxOutlier)
							.attr('y2', middleHeight - boxUpDownLength)
							.style('stroke', 'black');

							/*
							Creating the square
							 */
							
							var box = svg.append('rect')
							.attr('width', maxStdDeviation - minStdDeviation)
							.attr('height', boxHeight - strokeWidth)
							.attr('x', minStdDeviation)
							.attr('y', (bodyHeight / 2) - (boxHeight / 2))
							.attr('rx', 5)
							.attr('rx', 5)
							.style('fill', 'yellow')
							.style('stroke', 'black');

							/*
							Creating the median
							*/
							svg.append('line')
							.attr('x1', median)
							.attr('y1', middleHeight + boxUpDownLength - strokeWidth)
							.attr('x2', median)
							.attr('y2', middleHeight - boxUpDownLength - strokeWidth)
							.style('stroke', 'black');

							/*
							Creating the
							*/
							bar.append('rect')
							.attr('width', maxOutlier)
							.attr('height', boxHeight)
							.attr('x', 0)
							.attr('y', 0)
							.attr('rx', 5)
							.attr('rx', 5)
							.style('fill', '#3f51b5')
							.style('stroke', 'black');

							bar.append('text')         // append text
							.style('fill', 'black')   // fill the text with the colour black
							.attr('x', 10)           // set x position of left side of text
							.attr('y', middleHeight + 5)           // set y position of bottom of text 
							.text('Total Units: ' + _maxOutlier);

							bar.append('text')         // append text
							.style('fill', 'black')   // fill the text with the colour black
							.attr('x', median)           // set x position of left side of text
							.attr('y', middleHeight + 5)           // set y position of bottom of text 
							.text('Median: ' + parseInt(_median));
						};

						//createBox(100, 10, 20, 30, 40, 50);
						//createBox(100, 20, 30, 40, 50, 60);
						//createBox(200, 30, 40, 50, 60, 70);
						//
						var maxRange = 0;
						var minRange = 999999999;
						var visitRange = function(node, project, data) {
							for (var i = 0; i < node.estimations.length; ++i) {
								var estimationMean = parseFloat((parseInt(node.minestimations[i]) + 4 * parseInt(node.estimations[i]) + parseInt(node.maxestimations[i])) / 6).toFixed(2);
								var stdDeviation = parseFloat((parseInt(node.minestimations[i]) - parseInt(node.maxestimations[i])) / 6).toFixed(2);

								var minOutlier;
								var minStdDeviation = parseFloat((parseFloat(estimationMean) + parseFloat(stdDeviation)));
								if (node.minestimations[i] < minStdDeviation) {
									minOutlier = parseInt(node.minestimations[i]);
								} else {
									minOutlier = parseFloat(minStdDeviation);
								}
								var maxOutlier;
								var maxStdDeviation = parseFloat((parseFloat(estimationMean) - parseFloat(stdDeviation)));
								if (node.maxestimations[i] > maxStdDeviation) {
									maxOutlier = parseInt(node.maxestimations[i]);
								} else {
									maxOutlier = parseFloat(maxStdDeviation);
								}
								if (minOutlier < minRange) {
									minRange = minOutlier;
								}
								if (maxOutlier > maxRange) {
									maxRange = maxOutlier;		
								}
								
							}
						};

						var visitCalc = function(node, project, data) {
							for (var i = 0; i < node.estimations.length; ++i) {
								var estimationMean = parseFloat((parseInt(node.minestimations[i]) + 4 * parseInt(node.estimations[i]) + parseInt(node.maxestimations[i])) / 6).toFixed(2);
								var stdDeviation = parseFloat((parseInt(node.minestimations[i]) - parseInt(node.maxestimations[i])) / 6).toFixed(2);

								var minOutlier;
								var minStdDeviation = parseFloat((parseFloat(estimationMean) + parseFloat(stdDeviation)));
								if (node.minestimations[i] < minStdDeviation) {
									minOutlier = parseInt(node.minestimations[i]);
								} else {
									minOutlier = parseFloat(minStdDeviation);
								}
								var maxOutlier;
								var maxStdDeviation = parseFloat((parseFloat(estimationMean) - parseFloat(stdDeviation)));
								if (node.maxestimations[i] > maxStdDeviation) {
									maxOutlier = parseInt(node.maxestimations[i]);
								} else {
									maxOutlier = parseFloat(maxStdDeviation);
								}
								//console.log(40 + '}{' + minOutlier + '}{' + minStdDeviation + '}{' + estimationMean + '}{' + maxStdDeviation + '}{' + maxOutlier);
								createBox(maxRange - minRange, minOutlier - minRange, minStdDeviation - minRange, estimationMean - minRange, maxStdDeviation - minRange, maxOutlier - minRange);
							}
						};

						var traverseTree = function(node, project, data, visit) {
							if (node === null) {
								return;
							}
							visit(node, project, data);
							for (var i = 0; i < node.nodes.length; ++i) {
								traverseTree(node.nodes[i], project, data, visit);
							}
						};

						var generateReport = function(project, data , visit) {
							var projectTree = project.children[0];
							traverseTree(projectTree, project, data, visit);
						};

						scope.data = [];
						generateReport(project, scope.data, visitRange);
						generateReport(project, scope.data, visitCalc);

						/*
						var circle = svg.append('circle')
						.attr('cx', 25)
						.attr('cy', 25)
						.attr('r', 25)
						.style('fill', 'purple');

						//var svg = body.append('circle')
						//.attr('cx', 25)
						//.attr('cy', 25)
						//.attr('r', 25)
						//.style('fill', 'purple');
						var theData = [1, 2, 3, 4];
						body.selectAll('p')
						.data(theData)
						.enter()
						.append('p')
						.text(function(d , i) {
							return d + 'I will cahnge you forever' + 'index is ' + i;
						});
						
						var xdir = 0;
						var circleRadii = [40, 20, 10];
						svg.selectAll('circle')
						.data(circleRadii)
						.enter()
						.append('circle')
						.attr('cx', function(x) {
							xdir = xdir + 100;
							return xdir;
						})
						.attr('cy', 50)
						.attr('r', 25)
						.style('fill', function(d) {
							var color;
							if (d === 40) {
								color = 'green';
							}
							if (d === 20) {
								color = 'red';
							}
							return color;
						});
						*/
					
					});
				});
				//element.text('this is the boxPlot directive');
			}
		};
	}
]);
