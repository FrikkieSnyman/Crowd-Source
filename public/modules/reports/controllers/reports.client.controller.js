'use strict';

// Reports controller
angular.module('reports').controller('ReportsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Reports', 'Headerpath', 'RESOURCE_DOMAIN', 'Projects', '$mdToast',
	function($scope, $stateParams, $location, Authentication, Reports, Headerpath, RESOURCE_DOMAIN, Projects, $mdToast) {
		$scope.authentication = Authentication;
		$scope.goTo = function(route) {
			$location.path(route);
		};

		$scope.isOwner = function(project) {
			if ($scope.authentication.user.username !== undefined) {
				if (project.project.owner === $scope.authentication.user.username) {
					return true;
				}
			}
			return false;
		};

		$scope.reopenEstimation = function(project) {
			var reProject = project.project;
			project = new Projects ({
				name: reProject.name + ' Round ' + (parseInt(reProject.round) + 1),
				description: reProject.description,
				users : reProject.users,
				owner : $scope.authentication.user.username,
				openForEstimation : false,
				children : reProject.children,
				round : parseInt(reProject.round) + 1
			});
			project.$save(function(response) {
				$location.path('projects/' + project._id + '/edit');
				$mdToast.show(
					$mdToast.simple()
						.content('Project created')
						.position($scope.getToastPosition())
						.hideDelay(3000)
				);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
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
		$scope.toastPosition = {
			bottom: true,
			top: false,
			left: false,
			right: true
		};

		$scope.getToastPosition = function() {
			return Object.keys($scope.toastPosition)
			.filter(function(pos) { return $scope.toastPosition[pos]; })
			.join(' ');
		};
	}
]);
