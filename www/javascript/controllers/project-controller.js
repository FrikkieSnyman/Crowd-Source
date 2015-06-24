angular.module('main')
.controller('porjectCtrl', ['$scope', '$http', '$routeParams',
	function($scope, $http, $routeParams) {
	var project = {'heading': $routeParams.id};
	$http({method:'POST', url:'/project', data: project}).success(function(data) {
		$scope.project = data[0];
		$scope.tree = $scope.project.children;
	});
	$scope.saveProject = function() {
		$http({method:'POST', url:'/addChild', data: $scope.project});
	}
}]);
