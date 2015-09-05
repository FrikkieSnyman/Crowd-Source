'use strict';

// Projects controller
angular.module('projects').controller('ProjectsController', ['$interval','$scope', '$stateParams', '$location', 'Authentication', 'Projects', '$http', '$mdToast', '$mdDialog', '$timeout', '$rootScope', 'RESOURCE_DOMAIN',
	function($interval, $scope, $stateParams, $location, Authentication, Projects, $http, $mdToast, $mdDialog, $timeout, $rootScope, RESOURCE_DOMAIN) {

		$scope.goTo = function(route) {
			$location.path(route);
		};
		
		$scope.owner = function(project) {
			if (Authentication.user.username === project.owner) {
				return true;
			} else {
				return false;
			}
		};

		$scope.showAlert = function(ev, desc) {
			$mdDialog.show(
			  $mdDialog.alert()
				.parent(angular.element(document.querySelector('#popupContainer')))
				.clickOutsideToClose(true)
				.title('Description')
				.content(desc)
				.ariaLabel('Description')
				.ok('Close')
				.targetEvent(ev)
			);
		};

		$scope.mode = 'query';
		$scope.determinateValue = 30;
		$scope.determinateValue2 = 30;
		$interval(function() {
			$scope.determinateValue += 1;
			$scope.determinateValue2 += 1.5;
			if ($scope.determinateValue > 100) {
				$scope.determinateValue = 30;
				$scope.determinateValue2 = 30;
			}
		}, 100, 0, true);
		$interval(function() {
			$scope.mode = ($scope.mode == 'query' ? 'determinate' : 'query');
		}, 7200, 0, true);

		$scope.createProject = function() {
			//		var project = {'name': $scope.projectName, 'description': $scope.description, 'owner' : Authentication.user, 'users' : $scope.selected};
			var project = new Projects ({
				name: $scope.projectName,
				description: $scope.description,
				users : $scope.selected
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

		$scope.deleteProject = function(project) {
			var confirm = $mdDialog.confirm()
			.parent(angular.element(document.body))
			.title('Are you sure you wish to delete project ' + project.name + '?')
			.content('This will delete the project and prevent it from showing up in the list of projects.')
			.ariaLabel('Delete the project')
			.ok('Yes')
			.cancel('No');
			$mdDialog.show(confirm).then(function() {
				$timeout(function() {
					//$http({method:'DELETE', url:'/projects/' + project._id, data: project}).success(function() {
					//	$scope.updateProjects();
					//});
					$scope.remove(project);
				});
					//debugger;
			}, function() {
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

		// Remove existing Project
		$scope.remove = function(project) {
			if (project) { 
				project.$remove();

				for (var i in $scope.projects) {
					if ($scope.projects [i] === project) {
						$scope.projects.splice(i, 1);
					}
				}
			} else {
				$scope.project.$remove(function() {
					$location.path('projects');
				});
			}
		};

		// Update existing Project
		$scope.update = function() {
			var project = $scope.project;

			project.$update(function() {
				$location.path('projects/' + project._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Projects
		$scope.find = function() {
			$scope.projects = Projects.query();
		};

		// Find existing Project
		$scope.findOne = function() {
			$scope.project = Projects.get({ 
				projectId: $stateParams.projectId
			});
		};

		$scope.updateProjects = function() {
			$scope.projects = Projects.query();
		};

		$scope.querySearch = function(query) {
			//console.log(query);
			var results = query ? $scope.projects.filter(createFilterFor(query)) : $scope.projects, deferred;
			var indices = [];
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

		$scope.collapseAll = function() {
			$scope.$broadcast('collapseAll');
		};

		$scope.expandAll = function() {
			$scope.$broadcast('expandAll');
		};

		function DialogController($scope, $mdDialog) {
			$scope.hide = function() {
				$mdDialog.hide();
			};
			$scope.cancel = function() {
				$mdDialog.cancel();
			};
		}

		$scope.showDescriptionDialog = function(ev, node) {
			$scope.currentNode = node;

			$scope.setCurrentNode(node, function() {
				var newScope = $scope.$new();

				$mdDialog.show({
					controller: DialogController,
					templateUrl: 'modules/projects/views/description.dialog.client.view.html',
					parent: angular.element(document.body),
					targetEvent: ev,
					scope: newScope
				});
			});
		};

		$scope.isOverflow = function() {
			var element = document.getElementById('marquee');
			if (element.scrollWidth > element.clientWidth) {
				return true;
			} else {
				return false;
			}
		};

		$scope.isNotOverflow = function() {
			var element = document.getElementById('marquee');
			if (element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth) {
				return false;
			} else {
				return true;
			}
		};
	}
]);
