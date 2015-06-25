angular.module('main')
.controller('createProjectCtrl', ['$scope', '$http', '$mdToast', function($scope, $http, $mdToast) {

	$scope.$watch('testInput', function() {
		// console.log($scope.testInput);
	});
	$scope.createProject = function() {
		var project = {'heading': $scope.projectName, 'description': $scope.description};
		$http({method:'POST', url:'/createProject', data: project}).success(function() {
			$mdToast.show(
		    $mdToast.simple()
		    .content('Project created')
		    .position($scope.getToastPosition())
		    .hideDelay(3000)
	    	);
			$scope.goTo('/project' + project.name);
		});
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
