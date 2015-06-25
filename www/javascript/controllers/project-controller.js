angular.module('main')
.controller('porjectCtrl', ['$scope', '$http', '$routeParams', '$mdDialog', '$mdToast',
	function($scope, $http, $routeParams, $mdDialog, $mdToast) {
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
			}
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
		}
		$scope.addRootNode = function() {
			$scope.project.children.push({id: 'node', title:"Root Node" , nodes: [], collapsed : false});
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
				collapsed : false
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
	}]);
