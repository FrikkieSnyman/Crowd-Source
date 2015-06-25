angular.module('main')
.controller('porjectCtrl', ['$scope', '$http', '$routeParams', '$mdDialog',
	function($scope, $http, $routeParams, $mdDialog) {
		$scope.confirm = false;
		var project = {'heading': $routeParams.id};
		$http({method:'POST', url:'/project', data: project}).success(function(data) {
			$scope.project = data[0];
			$scope.tree = $scope.project.children;
			$scope.treeData = $scope.project.children[0];

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

			});
		}
		$scope.addRootNode = function() {
			$scope.project.children.push({id: 'node', title:"Root Node" ,nodes: [],collapsed : false, users : [], estimations : []});
		}
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

		}

		$scope.remove = function(scope) {
			scope.remove();
		};

		$scope.toggleNode = function(scope) {
			debugger;
			scope.toggle();
		};

		$scope.moveLastToTheBeginning = function() {
			var a = $scope.data.pop();
			$scope.data.splice(0, 0, a);
		};

		$scope.newSubItem = function(scope) {
			var nodeData = scope.$modelValue;
			nodeData.nodes.push({
				id: nodeData.id * 10 + nodeData.nodes.length,
				title: nodeData.title + '.' + (nodeData.nodes.length + 1),
				nodes: [],
				collapsed : false,
				users : [],
				estimations : []
			});
		};

		$scope.collapseAll = function() {
			$scope.$broadcast('collapseAll');
		};

		$scope.expandAll = function() {
			$scope.$broadcast('expandAll');
		};

		$scope.estimate = function(node) {
			// $http({method:'POST', url:'/estimate', data: $scope.project}).success(function() {

			// });

			var currnode = $scope.project.children[0];
			// console.log(currnode);
			var tmp;
			$scope.searchTree([currnode], node.$$hashKey, function(res) {
				tmp = res;
			});

			console.log(tmp);
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

			// callback(result);
		};

		$scope.getEstimateForUser = function() {
			return 1;
		};
	}]);
