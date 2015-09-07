'use strict';

angular.module('projects').controller('CreateProjectController', ['$scope', '$stateParams', '$location', 'Authentication', 'Projects', '$http', '$mdToast', '$mdDialog', '$timeout', '$rootScope', 'RESOURCE_DOMAIN',
	function($scope, $stateParams, $location, Authentication, Projects, $http, $mdToast, $mdDialog, $timeout, $rootScope, RESOURCE_DOMAIN) {
		$scope.authentication = Authentication;
		$scope.people = [];

		$http.get(RESOURCE_DOMAIN+'/users/getUsers').success(function(users) {
			for (var i in users) {
				$scope.people.push({
					name: users[i].username,
					firstName : users[i].firstName,
					lastName : users[i].lastName,
					selected: false
				});
			}
		});

		var buildSelectedArray = function() {
			var selected = [];

			for (var i in $scope.people) {
				if ($scope.people[i].selected) {
					selected.push({
						username : $scope.people[i].name,
						firstName : $scope.people[i].firstName,
						lastName : $scope.people[i].lastName
					});
				}
			}

			return selected;
		};

		$scope.createProject = function() {
			//		var project = {'name': $scope.projectName, 'description': $scope.description, 'owner' : Authentication.user, 'users' : $scope.selected};

			var project = new Projects ({
				name: $scope.projectName,
				description: $scope.description,
				users : buildSelectedArray(),
				owner : $scope.authentication.user.username,
				openForEstimation : false
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