'use strict';

// Reports controller
angular.module('reports').controller('ReportsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Reports', 'Headerpath', 'RESOURCE_DOMAIN','$mdDialog','$rootScope',
	function($scope, $stateParams, $location, Authentication, Reports, Headerpath, RESOURCE_DOMAIN, $mdDialog, $rootScope) {
		$scope.authentication = Authentication;
		
		$scope.goTo = function(route) {
			$location.path(route);
		};
		// Create new Report
		$scope.querySearch = function(query) {
			//console.log(query);
			var results = query ? $scope.reports.filter(createFilterFor(query)) : $scope.reports, deferred;
			return results;
		};
		$scope.searchTextChange = function(text) {
			console.log('Text changed to ' + text);
		};

		$scope.selectedItemChange = function(item) {
			console.log(item);
			$scope.goTo('/projects/' + item._id + '/edit');
		};

		var createFilterFor = function(query) {
			var lowercaseQuery = angular.lowercase(query);
			return function filterFn(item) {
				//console.log(item);
				var name = angular.lowercase(item.name);
				return (name.indexOf(lowercaseQuery) === 0);
			};
		};
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
			if (report) {
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
			}, function() {
				Headerpath.setReportPath($scope.report.name);
			});
		};
		$scope.getInfoDialog = function(ev,htmlDocumnet)
		{
			$mdDialog.show({
			templateUrl: htmlDocumnet,
			controller: DialogController,
			parent: angular.element(document.body),
			targetEvent: ev,
			clickOutsideToClose:true
			})
			.then(function(answer) {
				$rootScope.$broadcast('updateGraph',answer);
			$scope.status = 'You said the information was "' + answer + '".';
			}, function() {
			$scope.status = 'You cancelled the dialog.';
			});			
		};
		function DialogController($scope, $mdDialog) {
			$scope.hide = function() {
				$mdDialog.hide();
			};
			$scope.cancel = function() {
				$mdDialog.cancel();
			};
			$scope.select = function(report) {
				//console.log(report);
				$mdDialog.hide(report);
			};
		}
	}
]);
