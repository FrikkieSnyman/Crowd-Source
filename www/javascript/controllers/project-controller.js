angular.module('main')
.controller('porjectCtrl', ['$scope', '$http', '$routeParams',
	function($scope, $http, $routeParams) {
	var project = {'heading': $routeParams.id};
	$http({method:'POST', url:'/project', data: project}).success(function(data) {
		$scope.project = data[0];
		$scope.tree = $scope.project.children;
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
		$scope.project.children.push({name: "node", nodes: []});
	}
}]);
