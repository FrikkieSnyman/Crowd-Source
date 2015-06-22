angular.module('main')
.controller('createProjectCtrl', ['$scope', '$http', function($scope, $http) {

	$scope.$watch('testInput', function() {
		console.log($scope.testInput);
	});
	$scope.createProject = function() {
		var project = {'name': $scope.projectName, 'description': $scope.description};
		$http({method:'POST', url:'/createProject', data: 'project=' + project});
	};
}]);
