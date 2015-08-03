'use strict';

angular.module('reports').directive('barChart', ['D3',
	function(D3) {
		// return {
		// 	template: '<div></div>',
		// 	restrict: 'E',
		// 	link: function postLink(scope, element, attrs) {
		// 		// Bar chart directive logic
		// 		// ...

		// 		element.text('this is the barChart directive');
		// 	}
		// };
		return {
			link: function(scope, element, attrs) {
				D3.d3().then(function(d3) {
					// d3 is the raw d3 object
				});
			}
		};
	}
]);
