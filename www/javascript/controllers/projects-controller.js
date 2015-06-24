angular.module('main')
.controller('projectsCtrl', ['$scope', '$http', '$location', function($scope, $http, $location) {
	$http({method:'GET', url:'/projects'}).success(function(data) {
		$scope.projects = data;
	});

	$scope.createProject = function() {
		// console.log("Button press");
		$location.path('/createProject');
	};

	$scope.deleteProject = function(project) {
		$http({method:'POST', url:'/deleteProject', data: project}).success(function() {
			$scope.updateProjects();
		});
	};

	$scope.updateProjects = function() {
		$http({method:'GET', url:'/projects'}).success(function(data) {
			$scope.projects = data;
		});
	};

	// debugger;
}]);
