'use strict';

angular.module('reports').directive('boxPlot', ['D3',
	function() {
		return {
			restrict: 'EA',
			scope:{},
			link: function postLink(scope, element, attrs) {
				D3.d3().then(function(d3) {
					// d3 is the raw d3 object
				});

				//element.text('this is the boxPlot directive');
			}
		};
	}
]);