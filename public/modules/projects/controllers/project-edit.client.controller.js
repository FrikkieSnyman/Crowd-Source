'use strict';

angular.module('projects').controller('ProjectEditController', ['$scope', '$stateParams', '$location', 'Authentication', 'Projects', '$http', '$mdToast', '$mdDialog', '$timeout', '$rootScope',
	function($scope, $stateParams, $location, Authentication, Projects, $http, $mdToast, $mdDialog, $timeout, $rootScope) {
		$scope.people = [];
		$http.get('/users/getUsers').success(function(users) {
			for (var i in users) {
				$scope.people.push(users[i].username);
			}
		});

		$scope.authentication = Authentication;
		$scope.userIndex = -1;

		var project = {'projectId': $stateParams.projectId};
		$http({method:'POST', url:'/project', data: project}).success(function(data) {
			if (data.length !== 0) {
				var tmp = data[0];
				for (var u in tmp.users) {
					if (tmp.users[u] === $scope.authentication.user.username) {
						$scope.userIndex = u;
					}
				}

				if ($scope.userIndex === -1) {
					var toast = $mdToast.simple()
					.content('Not authorised to estimate')
					.action('')
					.highlightAction(false)
					.position($scope.getToastPosition());
					$mdToast.show(toast);					
				}
			}
		});
		$scope.rootIsEmpty = function() {
			if (typeof $scope.project.children !== undefined) {
					if ($scope.project.children.length < 1) {
						return true;
					}
			} else {
				return false;
			}
		};
		$scope.addRootNode = function() {
			// initialise estimations array
			var estimationsArr = [];
			for (var i in $scope.project.users) {
				estimationsArr.push(null);
			}
			$scope.project.children.push({id: 'node', title:'Root Node', nodes: [], collapsed : false, estimations : estimationsArr});
		};

		$scope.update = function() {
			var project = $scope.project;

			project.$update(function() {
				$location.path('projects/' + project._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.find = function() {
			$scope.projects = Projects.query();
		};

		// Find existing Project
		$scope.findOne = function() {
			$scope.project = Projects.get({ 
				projectId: $stateParams.projectId
			});
		};


		$scope.newSubItem = function(scope) {
			// console.log(scope.project.users);
			var nodeData = scope.$modelValue;
			// console.log(nodeData);
			var estimationsArr = [];
			for (var i in scope.project.users) {
				// console.log(i);
				estimationsArr.push(null);
			}
			nodeData.nodes.push({
				id: nodeData.id * 10 + nodeData.nodes.length,
				title: nodeData.title + '.' + (nodeData.nodes.length + 1),
				nodes: [],
				collapsed : false,
				estimations : estimationsArr
			});
		};

		$scope.undoToolTip = function(node, removeNode, newSubItem) {
			//debugger;
			var tree = $.extend(true, [], $scope.project.children);
			removeNode(node);
			var toast = $mdToast.simple()
				.content('Node deleted')
				.action('UNDO')
				.highlightAction(false)
				.position($scope.getToastPosition());
			$mdToast.show(toast).then(function() {
				$scope.project.children = $.extend(true, [], tree);
			});
		};

		$scope.saveProject = function() {
			console.log($scope.project);
			$scope.project.$update(function(response) {
				$mdToast.show(
					$mdToast.simple()
					.content('Project saved')
					.position($scope.getToastPosition())
					.hideDelay(3000)
				);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};
		$scope.querySearch = function(query) {
			//console.log(query);
			var results = query ? $scope.projects.filter(createFilterFor(query)) : $scope.projects, deferred;
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


		$scope.updateLocalTree = function(scope) {
			var user = Authentication.user.firstName + ' ' + Authentication.user.lastName;
			var count = $scope.userIndex; // might have to use $rootScope
			var found = false;
			var currnode = $scope.project.children[0];
			var result;
			
			$scope.getEstimation(currnode, count, function(res) {
				result = res;
			});
		};

		$scope.getEstimation = function(node, userNum, callback) {
			if (node.nodes.length <= 0) {
				callback(node.estimations[userNum]);
			}
			else {
				node.estimations[userNum] = null;
				for (var i in node.nodes) {
					$scope.getEstimation(node.nodes[i], userNum, function(result) {
						if (node.estimations[userNum] === null) {
							node.estimations[userNum] = parseInt(result);
						}
						else {
							node.estimations[userNum] += parseInt(result);
						}
						callback(parseInt(result));
					});
				}
			}
		};

		$scope.currentNode = undefined;

		$scope.setCurrentNode = function(node, callback) {
			$scope.currentNode = node;

			if (callback !== undefined) {
				callback();
			}
		};

		$scope.selected = [];
		$scope.toggle = function(item, list) {
			var idx = list.indexOf(item);
			if (idx > -1) {
				list.splice(idx, 1);
			} else {
				list.push(item);
			}
		};

		$scope.exists = function(item, list) {
			return list.indexOf(item) > -1;
		};

		$scope.$on('$locationChangeStart', function(event, newUrl, oldUrl) {
			// Appending dialog to document.body to cover sidenav in docs app
			if (!$scope.confirm) {
				event.preventDefault();
				//console.log(newUrl);
				var confirm = $mdDialog.confirm()
				.parent(angular.element(document.body))
				.title('Are you sure you want to leave this page?')
				.content('All unsaved changes will be lost.')
				.ariaLabel('Yes')
				.ok('Yes')
				.cancel('No')
				.targetEvent(event);
				$mdDialog.show(confirm).then(function() {
					newUrl = newUrl.split('#!');
					$scope.goTo(newUrl[1]);
					$scope.confirm = true;
					//$scope.saveProject();
				}, function() {});
			}
		});
	}
]);