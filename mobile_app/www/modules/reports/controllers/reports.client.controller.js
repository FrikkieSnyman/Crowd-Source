'use strict';

// Reports controller
angular.module('reports').controller('ReportsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Reports',
	function($scope, $stateParams, $location, Authentication, Reports) {
		$scope.authentication = Authentication;

		// Create new Report
		$scope.create = function() {
			// Create new Report object
			var report = new Reports ({
				name: this.name
			});

			// Redirect after save
			report.$save(function(response) {
				$location.path('reports/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Report
		$scope.remove = function(report) {
			if ( report ) { 
				report.$remove();

				for (var i in $scope.reports) {
					if ($scope.reports [i] === report) {
						$scope.reports.splice(i, 1);
					}
				}
			} else {
				$scope.report.$remove(function() {
					$location.path('reports');
				});
			}
		};

		// Update existing Report
		$scope.update = function() {
			var report = $scope.report;

			report.$update(function() {
				$location.path('reports/' + report._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Reports
		$scope.find = function() {
			$scope.reports = Reports.query();
		};

		// Find existing Report
		$scope.findOne = function() {
			$scope.report = Reports.get({ 
				reportId: $stateParams.reportId
			});
		};
	}
]);