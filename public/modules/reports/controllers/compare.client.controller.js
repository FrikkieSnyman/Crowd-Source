'use strict';

// Reports controller
angular.module('reports').controller('CompareController', ['$scope', '$stateParams', '$location', 'Authentication', 'Reports', 'Headerpath', 'RESOURCE_DOMAIN','$mdDialog',
	function($scope, $stateParams, $location, Authentication, Reports, Headerpath, RESOURCE_DOMAIN, $mdDialog) {
		// Find a list of Reports
		//Console.log("Hello");
		$scope.find = function() {
			$scope.reports = Reports.query();
		};
		
		$scope.find();
		
		$scope.querySearch = function(query) {
			//console.log(query);
			var results = query ? $scope.reports.filter(createFilterFor(query)) : $scope.reports, deferred;
			return results;
		};
		$scope.searchTextChange = function(text) {
			//console.log('Text changed to ' + text);
		};

		$scope.selectedItemChange = function(item) {
			//console.log(item);
			//$scope.goTo('/projects/' + item._id + '/edit');
			$scope.select(item);
		};

		var createFilterFor = function(query) {
			var lowercaseQuery = angular.lowercase(query);
			return function filterFn(item) {
				//console.log(item);
				var name = angular.lowercase(item.name);
				return (name.indexOf(lowercaseQuery) === 0);
			};
		};
	}
]);
