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
	}
	});
				$scope.saveProject = function() {
		$http({method:'POST', url:'/addChild', data: $scope.project}).success(function() {

		});
	}
				$scope.addRootNode = function() {
		$scope.project.children.push({name: 'node', nodes: []});
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
			}]);
