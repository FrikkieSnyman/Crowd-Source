'use strict';
angular.module('reports').directive('boxPlot', ['D3', '$window',
	function(D3, $window) {
		return {
			restrict : 'EA',
			scope : {},
			link : function(scope, element, attrs) {
				D3.d3().then(function(d3) {
					scope.$parent.report.$promise.then(function() {
						// d3 is the raw d3 object
						var body = d3.select(element[0]).append('p');
						//.attr('width', 50)
						//.attr('height', 50);
						//d3.select("body").node().getBoundingClientRect().width
						var bodyWidth = body.node().getBoundingClientRect().width;
						var bodyHeight = 50;
						var body = d3.select(element[0]);
						body.append('p').text('Box plot!');

						var createBox = function(_range, _minOutlier, _minStdDeviation, _median, _maxStdDeviation, _maxOutlier) {
							var svg = body.append('svg')
							.attr('width', bodyWidth)
							.attr('height', bodyHeight);
							var middleHeight = (bodyHeight / 2);
							var middleWidht = (bodyWidth / 2);
							var range = _range;
							var ratio = parseInt(bodyWidth / range);
							var strokeWidth = 30;
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
							.attr('height', boxHeight)
							.attr('x', minStdDeviation)
							.attr('y', (bodyHeight / 2) - (boxHeight / 2))
							.attr('rx', 5)
							.attr('rx', 5)
							.style('fill', 'lightblue')
							.style('stroke', 'black');

							/*
							Creating the median
							*/
							svg.append('line')
							.attr('x1', median)
							.attr('y1', middleHeight + boxUpDownLength)
							.attr('x2', median)
							.attr('y2', middleHeight - boxUpDownLength)
							.style('stroke', 'black');
						};

						createBox(100, 10, 20, 30, 40, 50);
						createBox(100, 20, 30, 40, 50, 60);
						createBox(200, 30, 40, 50, 60, 70);

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
