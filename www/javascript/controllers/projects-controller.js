angular.module('main')
.controller('projectsCtrl',['$scope','$http',function($scope,$http) {



	$http({method:'GET',url:'/projects'}).success(function(data) {
		console.log('hello');
		debugger;
		$scope.projects = data.projects;
	});

	// debugger;

}]);