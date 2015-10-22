'use strict';

angular.module('projects').controller('CreateProjectController', ['$scope', '$stateParams', '$location', 'Authentication', 'Projects', '$http', '$mdToast', '$mdDialog', '$timeout', '$rootScope', 'RESOURCE_DOMAIN',
	function($scope, $stateParams, $location, Authentication, Projects, $http, $mdToast, $mdDialog, $timeout, $rootScope, RESOURCE_DOMAIN) {
		$scope.authentication = Authentication;
		$scope.people = [];
		$scope.allOrganisations = [];
		$scope.allOrganisationNames = [];
		$scope.userOrganisations = [];
$scope.projectOrganisation = 'None';

		if(Authentication.user) {
			$scope.userOrganisations = Authentication.user.organisations;	
		}
		
		if ($scope.userOrganisations.indexOf('None') === -1) {
			$scope.userOrganisations.push('None');
		}

		$scope.$on('$locationChangeStart', function (event, next, current) {
			if ($scope.userOrganisations.indexOf('None') !== -1) {
				$scope.userOrganisations.splice($scope.userOrganisations.indexOf('None'), 1);
			}
		});

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

		$http.get(RESOURCE_DOMAIN+'/organisations').success(function(organisations) {
			for (var i in organisations) {
				$scope.allOrganisations.push(organisations[i]);
				$scope.allOrganisationNames.push(organisations[i].name);
			}
		});

		var buildSelectedArray = function() {
			var selected = [];

			for (var i in $scope.people) {
				if ($scope.people[i].selected) {
					selected.push($scope.people[i].name);
				}
			}

			return selected;
		};

		var getOrganisation = function() {
			if ($scope.projectOrganisation === 'None') {
				return '';
			} else {
				return $scope.projectOrganisation;
			}
		};

		$scope.createProject = function() {
			//		var project = {'name': $scope.projectName, 'description': $scope.description, 'owner' : Authentication.user, 'users' : $scope.selected};

			var project = new Projects ({
				name: $scope.projectName,
				description: $scope.description,
				users : buildSelectedArray(),
				owner : $scope.authentication.user.username,
				organisation : getOrganisation(),
				openForEstimation : false,
				round : 1
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

		$scope.queryEstimators = function() {
			var results = ($scope.projectOrganisation && $scope.projectOrganisation !== 'None') ? $scope.people.filter(createFilterFor($scope.projectOrganisation)) : $scope.people, deferred;
			var indices = [];

			return results;
		};

		var createFilterFor = function(organisation) {
			return function filterFn(item) {
				var index = $scope.allOrganisationNames.indexOf(organisation);

				return ($scope.allOrganisations[index].members.indexOf(item.name) !== -1);
			};
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