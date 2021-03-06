'use strict';

angular.module('projects').controller('ProjectEditController', ['$scope', '$stateParams', '$location', 'Authentication', 'Projects', '$http', '$mdToast', '$mdDialog', '$timeout', '$rootScope', 'Headerpath', 'RESOURCE_DOMAIN', 'Socket',
	function($scope, $stateParams, $location, Authentication, Projects, $http, $mdToast, $mdDialog, $timeout, $rootScope, Headerpath, RESOURCE_DOMAIN, Socket) {
		$scope.members = true;
		$scope.estimated = false;
		$rootScope.project = $scope.project;
		Socket.on('project.updated', function(project) {
			if (project._id === $scope.project._id) {
				$scope.project.__v = project.__v;
				$scope.updateChildren(project.children[0], $scope.project.children[0]);
	    	}
		});

		$scope.visit = function(node, scopeNode) {
			scopeNode.chat = node.chat;
			for (var i = 0; i < node.estimations.length; ++i) {
				if (i !== parseInt($scope.userIndex)) {
					scopeNode.estimations[i] = node.estimations[i];
					scopeNode.minestimations[i] = node.minestimations[i];
					scopeNode.maxestimations[i] = node.maxestimations[i];
				}
			}
		};

		$scope.updateChildren = function(node, scopeNode) {
			if (node === null) {
				return;
			}
			$scope.visit(node, scopeNode);
			for (var i = 0; i < node.nodes.length; ++i) {
				$scope.updateChildren(node.nodes[i], scopeNode.nodes[i]);
			}
		};

		$scope.goTo = function(route) {
			$location.path(route);
		};

		$scope.authentication = Authentication;
		$scope.userIndex = -1;
		var project = {'projectId': $stateParams.projectId};
		$http({method:'POST', url:RESOURCE_DOMAIN + '/project', data: project}).success(function(data) {
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

		$scope.showEstimators = false;
		$scope.showEstimation = false;

		$scope.rootIsEmpty = function() {
			if ($scope.project.$resolved !== false) {
				if ($scope.project.children.length < 1) {
					return true;
				} else {
					return false;
				}
			}
		};

		$scope.toggleEstimatorsList = function() {
			$scope.showEstimators = !$scope.showEstimators;
		};

		$scope.initUsers = function() {
			$http.get(RESOURCE_DOMAIN + '/users/getUsers').success(function(users) {
				$scope.people = [];
				$scope.userDetails = [];
				for (var i in users) {
					var tempIsEstimator = false;
					for (var j = 0; j < $scope.project.users.length; ++j) {
						if (users[i].username === $scope.project.users[j]) {
							tempIsEstimator = true;
						}
					}
					$scope.people.push({
						username : users[i].username,
						firstName : users[i].firstName,
						lastName : users[i].lastName,
						isEstimator : tempIsEstimator,
						unchangedIsEstimator : tempIsEstimator
					});
					$scope.userDetails[users[i].username] = {
						firstName : users[i].firstName,
						lastName : users[i].lastName
					};
				}
			});
		};

		$scope.showAddEstimatorDialogBox = function(ev) {
			var newScope = $scope.$new();

			if ($scope.project.organisation) {
				var organisation = {
					name: $scope.project.organisation
				};

				$http({method:'POST', url:RESOURCE_DOMAIN + '/organisations/getOrganisation', data: organisation}).success(function(data) {
					newScope.people = [];

					console.log(data);

					for (var i = $scope.people.length - 1; i >= 0; i--) {
						if (data.members.indexOf($scope.people[i].username) !== -1) {
							newScope.people.push($scope.people[i]);
						}
					}
				});
			}

			$mdDialog.show({
				controller: DialogController,
				templateUrl: 'modules/projects/views/add-estimator.client.view.html',
				parent: angular.element(document.body),
				targetEvent: ev,
				scope: newScope
			});
		};

		$scope.updateEstimators = function() {
			var add = [];
			var remove = [];

			for (var k = 0; k < $scope.project.users.length; ++k) {
				remove.push(k);
			}

			for (var i = 0; i < $scope.people.length; ++i) {
				if ($scope.people[i].isEstimator === true) {
					var found = false;
					for (var j = 0; j < $scope.project.users.length; ++j) {
						if ($scope.project.users[j]/*.username*/ === $scope.people[i].username) {
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

			$scope.removeEstimatorsFromProject(remove);
			$scope.addEstimatorsToProject(add);

			$scope.saveProject();
		};

		$scope.removeEstimatorsFromProject = function(removeArr) {
			for (var i = removeArr.length - 1; i >= 0; --i) {
				$scope.project.users.splice(removeArr[i], 1);
			}

			if ($scope.project.children.length > 0) {
				$scope.removeEstimatorsRecursiveDescent($scope.project.children[0], removeArr);
			}
		};

		$scope.removeEstimatorsRecursiveDescent = function(node, removeArr) {
			var i;
			for (i = removeArr.length - 1; i >= 0; --i) {
				node.estimations.splice(removeArr[i], 1);
				node.minestimations.splice(removeArr[i], 1);
				node.maxestimations.splice(removeArr[i], 1);
			}

			for (i = 0; i < node.nodes.length; ++i) {
				$scope.removeEstimatorsRecursiveDescent(node.nodes[i], removeArr);
			}
		};

		$scope.addEstimatorsToProject = function(addArr) {
			var i;
			for (i = 0; i < addArr.length; ++i) {
				$scope.project.users.push(addArr[i]);
			}

			if ($scope.project.children.length > 0) {
				$scope.addEstimatorsRecursiveDescent($scope.project.children[0], addArr);
			}
		};

		$scope.addEstimatorsRecursiveDescent = function(node, addArr) {
			var i;
			for (i = 0; i < addArr.length; ++i) {
				node.estimations.push(null);
				node.minestimations.push(null);
				node.maxestimations.push(null);
			}

			for (i = 0; i < node.nodes.length; ++i) {
				$scope.addEstimatorsRecursiveDescent(node.nodes[i], addArr);
			}
		};

		$scope.owner = function() {
			if ($scope.project.$resolved !== false) {
				if ($scope.project.owner === $scope.authentication.user.username) {
					return true;
				} else {
					return false;
				}
			}
		};

		$scope.estimator = function() {
			if ($scope.userIndex === -1) {
				return false;
			} else {
				return true;
			}
		};

		$scope.submitEstimation = function() {
			$scope.saveProject(function() {
				$scope.estimated = true;
				$scope.determineEstimations();	
			});
		};

		$scope.determineEstimations = function() {
			for (var i = 0; i < $scope.project.users.length; ++i) {
				if ($scope.project.children[0].estimations[i] === null) {
					// An estimator still hasn't estimated
					return;
				}
			}
			// $scope.project.openForEstimation = false;
			$scope.sendEstimationReport();
		};

		$scope.sendEstimationReport = function() {
			$http({method:'POST', url:RESOURCE_DOMAIN + '/reports', data: $scope.project}).success(function(data) {

			});
		};

		$scope.openForEstimation = function() {
			for (var i in $scope.project.children[0].estimations) {
				$scope.project.children[0].estimations[i] = null;
			}
			var confirm = new $mdDialog.confirm()
			.title('Are you sure you want to open the project for estimations?')
			.content('This will allow estimators to estimate, but will lock the project tree to its current state.')
			.ariaLabel('Open for estimation')
			.ok('Yes')
			.cancel('No');
			$mdDialog.show(confirm).then(function() {
				$timeout(function() {
					$scope.project.openForEstimation = true;
					$scope.saveProject();

					var project = {'projectId': $scope.project._id};

					$http({method:'POST', url:RESOURCE_DOMAIN + '/sendInvites', data: project}).success(function(data) {
						
					});
				});
			}, function() {
			});
		};

		$scope.isOpenForEstimation = function() {
			if ($scope.project.$resolved !== false) {
			return $scope.project.openForEstimation;
			} else {
				return false;
			}
		};

		$scope.addRootNode = function() {
			// initialise estimations array
			var estimationsArr = [];
			var minEstimations = [];
			var maxEstimations = [];
			for (var i in $scope.project.users) {
				estimationsArr.push(null);
				minEstimations.push(null);
				maxEstimations.push(null);
			}
			$scope.project.children.push({
				id: new Date().getTime(),
				title: $scope.project.name,
				nodes: [],
				chat : [],
				collapsed : false,
				estimations : estimationsArr,
				minestimations : minEstimations,
				maxestimations : maxEstimations
			});
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
			}, function() {
				Headerpath.setProjectPath($scope.project.name);
				$scope.initUsers();

				if ($scope.project.children.length <= 0) {
					$scope.addRootNode();
				}

				if ($scope.project.children[0].estimations[$scope.userIndex] === null) {
					$scope.estimated = false;
				} else {
					$scope.estimated = true;
				}
				$scope.updateLocalTree();
			});
		};

		$scope.newSubItem = function(scope) {
			// console.log(scope.project.users);
			var nodeData = scope.$modelValue;
			if (nodeData === undefined) {
				nodeData = $scope.project.children[0];
			}
			// console.log(nodeData);
			var estimationsArr = [];
			var minEstimations = [];
			var maxEstimations = [];
			for (var i in scope.project.users) {
				// console.log(i);
				estimationsArr.push(null);
				minEstimations.push(null);
				maxEstimations.push(null);
			}
			nodeData.nodes.push({
				id: new Date().getTime(),
				title: '',
				nodes: [],
				chat : [],
				collapsed : false,
				estimations : estimationsArr,
				minestimations : minEstimations,
				maxestimations : maxEstimations
			});
			$scope.updateLocalTree();
		};

		$scope.undoToolTip = function(node, removeNode, newSubItem) {
			var tree = {};
			tree = angular.merge(tree, $scope.project.children);
			removeNode(node);

			var toast = $mdToast.simple()
				.content('Node deleted')
				.action('UNDO')
				.highlightAction(true)
				.position($scope.getToastPosition());
			$mdToast.show(toast).then(function(response) {
				if (response === 'ok') {
					$scope.project.children = angular.merge($scope.project.children, tree);
					$scope.updateLocalTree();
				}
			});
			$scope.updateLocalTree();
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

		$scope.saveProject = function(callback) {
			$scope.project.$update(function(response) {
				$mdToast.show(
					$mdToast.simple()
					.content('Project saved')
					.position($scope.getToastPosition())
					.hideDelay(3000)
				);
				if (callback !== undefined) {
					callback();
				}
			}, function(errorResponse) {
				$scope.error = errorResponse;
			});
		};

		$scope.querySearch = function(query) {
			var results = query ? $scope.projects.filter(createFilterFor(query)) : $scope.projects, deferred;
			return results;
		};

		$scope.searchTextChange = function(text) {
		
		};

		$scope.selectedItemChange = function(item) {
		
			$scope.goTo('/projects/' + item._id + '/edit');
		};

		var createFilterFor = function(query) {
			var lowercaseQuery = angular.lowercase(query);
			return function filterFn(item) {
			
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

		$scope.checkNaN = function(number) {
			if (isNaN(number)) {
				return 0;
			} else {
				return number;
			}
		};

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

		$scope.showChatDialog = function(ev, node) {
			$scope.setCurrentNode(node, function() {
				$mdDialog.show({
					controller: DialogController,
					templateUrl: 'modules/projects/views/chat.dialog.client.view.html',
					parent: angular.element(document.body),
					targetEvent: ev
				});
			});
		};

		$scope.isNodeNamesValid = false;
		$scope.updateLocalTree = function(scope, node) {
			$scope.isNodeNamesValid = true;
			if ($scope.project.children[0].nodes.length <= 0) {
				$scope.isNodeNamesValid = false;
			}
			var count = $scope.userIndex;
			var currnode = $scope.project.children[0];
			var result;
			$scope.getEstimation(currnode, count, function(/*res*/) {
				// result = res;
			});
		};

		var minMaxDefaultRange = 2;
		$scope.getEstimation = function(node, userNum, callback) {
			if (node.title === undefined || node.title === null || node.title.length <= 0) {
				$scope.isNodeNamesValid = false;
			}

			if (node.nodes.length <= 0) {
				callback(node.estimations[userNum], node.minestimations[userNum], node.maxestimations[userNum]);
			} else {
				node.estimations[userNum] = null;
				node.minestimations[userNum] = null;
				node.maxestimations[userNum] = null;

				var func =  function(result, minRes, maxRes) {
					if (node.estimations[userNum] === null) {
						node.estimations[userNum] = parseInt(result);
					} else {
						node.estimations[userNum] += parseInt(result);
					}

					if (node.minestimations[userNum] === null) {
						node.minestimations[userNum] = parseInt(minRes);
					} else {
						node.minestimations[userNum] += parseInt(minRes);
					}

					if (node.maxestimations[userNum] === null) {
						node.maxestimations[userNum] = parseInt(maxRes);
					} else {
						node.maxestimations[userNum] += parseInt(maxRes);
					}
					callback(parseInt(result), parseInt(minRes), parseInt(maxRes));
				};

				for (var i in node.nodes) {
					$scope.getEstimation(node.nodes[i], userNum, func);
				}
			}
		};

		$scope.currentNode = undefined;

		$scope.setCurrentNode = function(node, callback) {
			$scope.currentNode = node;
			$rootScope.currentNode = node;
			if (callback !== undefined) {
				callback();
			}
		};

		$scope.$on('$locationChangeStart', function(event, newUrl, oldUrl) {
			if (!$scope.confirm) {
				event.preventDefault();
			
				var confirm = $mdDialog.confirm()
				.title('Are you sure you want to leave this page?')
				.content('All unsaved changes will be lost.')
				.ariaLabel('Yes')
				.ok('Yes')
				.cancel('No');
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
