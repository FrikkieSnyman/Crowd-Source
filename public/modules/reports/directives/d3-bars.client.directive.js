'use strict';

angular.module('reports').directive('d3Bars', ['D3', '$window',
	function(D3, $window) {
		return {
			restrict : 'EA',
			scope : {},
			link : function(scope, element, attrs) {
				D3.d3().then(function(d3) {
					scope.$parent.report.$promise.then(function() {
						var project = scope.$parent.report.project;

						var margin = parseInt(attrs.margin) || 20;
						var barHeight = parseInt(attrs.barHeight) || 20;
						var barPadding = parseInt(attrs.barPadding) || 10;
						var svg = d3.select(element[0])
							.append('svg')
							.style('width', '100%');

						var visit = function(node, project, data) {
							for (var i = 0; i < node.estimations.length; ++i) {
								var estimationMean = parseFloat((parseInt(node.minestimations[i]) + 4 * parseInt(node.estimations[i]) + parseInt(node.maxestimations[i])) / 6).toFixed(2);
								data.push({title: node.title, name: project.users[i], score: estimationMean});
							}
						};

						var traverseTree = function(node, project, data) {
							if (node === null) {
								return;
							}
							visit(node, project, data);
							for (var i = 0; i < node.nodes.length; ++i) {
								traverseTree(node.nodes[i], project, data);
							}
						};

						var generateReport = function(project, data) {
							var projectTree = project.children[0];
							traverseTree(projectTree, project, data);
						};

						window.onresize = function() {
							scope.$apply();
						};

						scope.data = [];

						generateReport(project, scope.data);

						scope.$watch(function() {
							return angular.element($window)[0].width;
						}, function() {
							scope.render(scope.data);
						});

						scope.render = function(data) {
							svg.selectAll('*').remove();
							if (!data) {
								return;
							}
							var width = d3.select("#chart").node().getBoundingClientRect().width
							//var width = 400;
							var height = scope.data.length * (barHeight + barPadding);
							var color = d3.scale.category20();
							var xScale = d3.scale.linear()
								.domain([0, d3.max(data, function(d) {
									return d.score;
								})])
								.range([0, width]);

							svg.attr('height', height);

							svg.selectAll('rect')
								.data(data).enter()
									.append('rect')
									.attr('height', barHeight)
									.attr('width', 250)
									.attr('x', Math.round(margin / 2))
									.attr('y', function(d, i) {
										return i * (barHeight + barPadding);
									})
									.attr('fill', function(d) {
										return color(d.score);
									})
									.transition()
										.duration(1000)
										.attr('width', function(d) {
											return xScale(d.score);
										});

							svg.selectAll('text')
								.data(data)
								.enter()
								.append('text')
								.attr('fill', '#000')
								.attr('y', function(d, i) {
									return i * (barHeight + barPadding) + 15;
								})
								.attr('x', 15)
								.text(function(d) {
									return d.title + ': ' + d.name + ' estimated: ' + d.score;
								});
						};
					});
				});
			}
		};
	}
]);
