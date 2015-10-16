'use strict';

// Organisations controller
angular.module('organisations').controller('OrganisationsController', ['$scope', '$stateParams', '$location', '$http', '$mdToast', '$mdDialog', 'Authentication', 'Organisations', 'Headerpath', 'RESOURCE_DOMAIN',
	function($scope, $stateParams, $location, $http, $mdToast, $mdDialog, Authentication, Organisations, Headerpath, RESOURCE_DOMAIN) {
		$scope.authentication = Authentication;
		$scope.people = [];

		$http.get(RESOURCE_DOMAIN + '/users/getUsers').success(function(users) {
			for (var i in users) {
				$scope.people.push({
					name: users[i].username,
					firstName : users[i].firstName,
					lastName : users[i].lastName,
					selected: false
				});
			}
		});

		$scope.goTo = function(route) {
			$location.path(route);
		};

		$scope.toggleMemberList = function() {
			$scope.showMembers = !$scope.showMembers;
		};

		$scope.showProjectList = false;

		$scope.toggleProjectList = function() {
			console.log($scope.organisation.projects);
			$scope.showProjectList = !$scope.showProjectList;
		};

		var buildSelectedArray = function() {
			var selected = [];

			for (var i in $scope.people) {
				if ($scope.people[i].selected) {
					selected.push($scope.people[i].name);
				}
			}

			return selected;
		};

		// Create new Organisation
		$scope.create = function() {
			// Create new Organisation object
			var organisation = new Organisations ({
				name: this.name,
				description: this.description,
				members: buildSelectedArray(),
				owner : $scope.authentication.user.username
			});

			// Redirect after save
			organisation.$save(function(response) {
				$location.path('organisations/' + response._id + '/edit');
				$mdToast.show(
					$mdToast.simple()
						.content('Organisation created')
						.position($scope.getToastPosition())
						.hideDelay(3000)
				);

				// Clear form fields
				$scope.name = '';

				// Update user information
				if (organisation.members.indexOf(Authentication.user.username) !== -1) {
					Authentication.user.organisations.push(organisation.name);
				}
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Organisation
		$scope.remove = function(organisation) {
			if ( organisation ) { 
				organisation.$remove();

				Authentication.user.organisations.splice(Authentication.user.organisations.indexOf(organisation.name), 1);

				for (var i in $scope.organisations) {
					if ($scope.organisations [i] === organisation) {
						$scope.organisations.splice(i, 1);
					}
				}
			} else {
				$scope.organisation.$remove(function() {
					$location.path('organisations');
				});
			}
		};

		// Update existing Organisation
		$scope.update = function() {
			var organisation = $scope.organisation;

			organisation.$update(function() {
				$location.path('organisations/' + organisation._id);

				// Update user information
				if ($scope.organisation.members.indexOf(Authentication.user.username) !== -1) {
					Authentication.user.organisations.push($scope.organisation.name);
				} else {
					Authentication.user.organisations.splice(Authentication.user.organisations.indexOf($scope.organisation.name), 1);
				}
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Organisations
		$scope.find = function() {
			$scope.organisations = [];
			var tempOrganisations = Organisations.query(function() {
				tempOrganisations.forEach(function(organisation) {
					if (organisation.members.indexOf(Authentication.user.username) !== -1 || organisation.owner === Authentication.user.username) {
						$scope.organisations.push(organisation);
					}
				});
			});
		};

		// Find existing Organisation
		$scope.findOne = function() {
			$scope.organisation = Organisations.get({ 
				organisationId: $stateParams.organisationId
			}, function() {
				Headerpath.setOrganisationPath($scope.organisation.name);

				$scope.initUsers();
			});
		};

		$scope.querySearch = function(query) {
			//console.log(query);
			var results = query ? $scope.organisations.filter(createFilterFor(query)) : $scope.organisations, deferred;
			return results;
		};

		var createFilterFor = function(query) {
			var lowercaseQuery = angular.lowercase(query);
			return function filterFn(item) {
				//console.log(item);
				var name = angular.lowercase(item.name);
				return (name.indexOf(lowercaseQuery) === 0);
			};
		};

		$scope.searchTextChange = function(text) {
			// console.log('Text changed to ' + text);
		};

		$scope.selectedItemChange = function(item) {
			// console.log(item);
			$scope.goTo('/organisations/' + item._id + '/edit');
		};

		$scope.initUsers = function() {
			$http.get(RESOURCE_DOMAIN + '/users/getUsers').success(function(users) {
				$scope.people = [];
				$scope.userDetails = [];
				for (var i in users) {
					var tempIsMember = false;
					for (var j = 0; j < $scope.organisation.members.length; ++j) {
						if (users[i].username === $scope.organisation.members[j]) {
							tempIsMember = true;
						}
					}
					$scope.people.push({
						username : users[i].username,
						firstName : users[i].firstName,
						lastName : users[i].lastName,
						isMember : tempIsMember
					});
					$scope.userDetails[users[i].username] = {
						firstName : users[i].firstName,
						lastName : users[i].lastName
					};
				}
			});
		};

		$scope.owner = function(organisation) {
			if (Authentication.user.username === organisation.owner) {
				return true;
			} else {
				return false;
			}
		};

		$scope.updateMembers = function() {
			var add = [];
			var remove = [];

			for (var k = 0; k < $scope.organisation.members.length; ++k) {
				remove.push(k);
			}

			for (var i = 0; i < $scope.people.length; ++i) {
				if ($scope.people[i].isMember === true) {
					var found = false;
					for (var j = 0; j < $scope.organisation.members.length; ++j) {
						if ($scope.organisation.members[j]/*.username*/ === $scope.people[i].username) {
							var index = remove.indexOf(j);
							if (index > -1) {
								remove.splice(index, 1);
							}

							found = true;
							break;
						}
					}

					if (found === false) {
						add.push($scope.people[i].username);
					}
				}
			}

			// removing members
			for (i = remove.length - 1; i >= 0; --i) {
				$scope.organisation.members.splice(remove[i], 1);
			}

			// adding members
			for (i = 0; i < add.length; ++i) {
				$scope.organisation.members.push(add[i]);
			}

			$scope.saveOrganisation();
		};

		$scope.saveOrganisation = function() {
			$scope.organisation.$update(function(response) {
				// Update user information
				if ($scope.organisation.members.indexOf(Authentication.user.username) !== -1) {
					Authentication.user.organisations.push($scope.organisation.name);
				} else {
					Authentication.user.organisations.splice(Authentication.user.organisations.indexOf($scope.organisation.name), 1);
				}

				$mdToast.show(
					$mdToast.simple()
					.content('Organisation saved')
					.position($scope.getToastPosition())
					.hideDelay(3000)
				);
			}, function(errorResponse) {
				$scope.error = errorResponse;
			});
		};

		// $scope.update = function() {
		// 	var organisation = $scope.organisation;
		// 	organisation.$update(function() {
		// 		$location.path('organisations/' + organisation._id);
		// 	}, function(errorResponse) {
		// 		$scope.error = errorResponse.data.message;
		// 	});
		// };

		$scope.showAddMemberDialogBox = function(ev) {
			var newScope = $scope.$new();
			// newScope.organisation = $scope.organisation;
			$mdDialog.show({
				controller: DialogController,
				templateUrl: 'modules/organisations/views/add-member.client.view.html',
				parent: angular.element(document.body),
				targetEvent: ev,
				scope: newScope
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

		$scope.isMember = function() {
			for (var i = 0; i < $scope.people.length; ++i) {
				if ($scope.people[i].isMember === true && $scope.people[i].username === $scope.authentication.user.username) {
					return true;
				}
			}
			return false;
		};

		function DialogController($scope, $mdDialog) {
			$scope.hide = function() {
				$mdDialog.hide();
			};
			$scope.cancel = function() {
				$mdDialog.cancel();
			};
		}
	}
]);