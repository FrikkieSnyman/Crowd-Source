angular.module('main')
.controller('porjectCtrl', ['$rootScope', '$scope', '$http', '$routeParams', '$mdDialog', '$mdToast',
	function($rootScope, $scope, $http, $routeParams, $mdDialog, $mdToast) {
		$scope.confirm = false;
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
		var project = {'heading': $routeParams.id};
		$http({method:'POST', url:'/project', data: project}).success(function(data) {
			$scope.project = data[0];
			$scope.tree = $scope.project.children;
			$scope.userIndex = -1;
			for (var u in $scope.project.users) {
				if ($scope.project.users[u] === $rootScope.currentUser) {
					$scope.userIndex = u;
				}
			}
// UserIndex is -1 if user trying to estimate is not in users array
			if ($scope.userIndex === -1) {
				var toast = $mdToast.simple()
				.content('Not authorised to estimate')
				.action('')
				.highlightAction(false)
				.position($scope.getToastPosition());
				$mdToast.show(toast);
			}
			$scope.rootIsEmpty = function() {
				//debugger;
				if (typeof $scope.project.children !== undefined) {
					if ($scope.project.children.length < 1) {
						return true;
					}
				} else {
					return false;
				}
			};
		});
		$scope.saveProject = function() {
			$http({method:'POST', url:'/addChild', data: $scope.project}).success(function() {
				$mdToast.show(
					$mdToast.simple()
					.content('Project saved')
					.position($scope.getToastPosition())
					.hideDelay(3000)
			);
			});

		};

		$scope.addRootNode = function() {
			// initialise estimations array
			var estimationsArr = [];
			for (i in $scope.project.users) {
				console.log(i);
				estimationsArr.push(null);
			}
			$scope.project.children.push({id: 'node', title:"Root Node", nodes: [], collapsed : false, estimations : estimationsArr});
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
				newUrl = newUrl.split('#');
				$scope.goTo(newUrl[1]);
				$scope.confirm = true;
				//$scope.saveProject();
			}, function() {
				
			});
			}
		
		});
		
		$scope.saveProjectDialog = function() {

		};

		$scope.moveLastToTheBeginning = function() {
			var a = $scope.data.pop();
			$scope.data.splice(0, 0, a);
		};

		$scope.newSubItem = function(scope) {
			// console.log(scope.project.users);
			var nodeData = scope.$modelValue;
			// console.log(nodeData);
			var estimationsArr = [];
			for (i in scope.project.users) {
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

		$scope.collapseAll = function() {
			$scope.$broadcast('collapseAll');
		};

		$scope.expandAll = function() {
			$scope.$broadcast('expandAll');
		};

		$scope.getToastPosition = function() {
			return Object.keys($scope.toastPosition)
			.filter(function(pos) { return $scope.toastPosition[pos]; })
			.join(' ');
		};

		$scope.toastPosition = {
			bottom: true,
			top: false,
			left: false,
			right: true
		};

		$scope.estimate = function(node) {
			var currnode = $scope.project.children[0];
			var n;
			$scope.searchTree([currnode], node.$$hashKey, function(res) {
				n = res;
			});
			$scope.estimateForUser(n, node.qty);
		};

		$scope.estimateForUser = function(node, qty) {
			var user = $rootScope.currentUser;
			var count = 0;
			var found = false;
			for (var u in node.users) {
				if (node.users[u] === user) {
					found = true;
					count = u;
					break;
				}
			}
			if (!found) {
				node.users.push(user);
				node.estimations.push(qty);
			} else {
				node.estimations[count] = qty;
			}
		};

		$scope.searchTree = function(node, id, callback) {
			var found = false;
			var result;
			for (var i in node) {
				if (id === node[i].$$hashKey) {
					found = true;
					callback(node[i]);
				}
			}
			if (found === false) {
				for (i in node) {
					$scope.searchTree(node[i].nodes, id, callback);
				}
			}
		};

		$scope.updateLocalTree = function(scope) {
			// currnode.estimations[userIndex] = 1000;
			// var user = $rootScope.currentUser;
			// var userPosition = 0;
			// var found = false;
			// for (i in node.users) {
			// 	if (node.users[i] === user) {
			// 		found = true;
			// 		count = i;
			// 		break;
			// 	}
			// }

			var user = $rootScope.currentUser;
			var count = 0;
			var found = false;

			console.log(scope.project.users);

			for (var u in scope.project.users) {
				if (scope.project.users[u] === user) {
					found = true;
					count = u;
					break;
				}
			}

			var currnode = $scope.project.children[0];
			// currnode.estimations[count] = 1000 * $scope.userIndex;


			var result;
			$scope.getEstimation(currnode, count, function(res) {
				result = res;
				console.log('Root node estimation: ' + result);
			});

			console.log('Current User: ' + $rootScope.currentUser);
			console.log('Calc user ind: ' + count);
			console.log('User index: ' + $scope.userIndex);
			console.log(currnode.nodes);
		};

		$scope.getEstimation = function(node, userNum, callback) {
			if (node.nodes.length <= 0) {
				callback(node.estimations[userNum]);
			}
			else {
				node.estimations[userNum] = null;
				for (var i in node.nodes) {
					debugger;
					$scope.getEstimation(node.nodes[i], userNum, function(result) {
						if (node.estimations[userNum] === null || node.nodes.length <= 1) {
							node.estimations[userNum] = parseInt(result);
						}
						else /*if (result !== null)*/ {
							node.estimations[userNum] += parseInt(result);
						}
						callback(node.estimations[userNum]);
					});
				}
			}
		};

		$scope.currentNode = undefined;

		$scope.showDescriptionDialog = function(ev, node) {
			$scope.currentNode = node;

			$scope.setCurrentNode(node, function() {
				var newScope = $scope.$new();

				$mdDialog.show({
					controller: DialogController,
					templateUrl: '../../templates/dialogs/project_node_description.tmpl.html',
					parent: angular.element(document.body),
					targetEvent: ev,
					scope: newScope
				});
			});
		};
		
		$scope.setCurrentNode = function(node, callback) {
			$scope.currentNode = node;

			if (callback !== undefined) {
				callback();
			}
		};
	}]);

function DialogController($scope, $mdDialog) {
	$scope.hide = function() {
		$mdDialog.hide();
	};
	$scope.cancel = function() {
		$mdDialog.cancel();
	};
}