angular.module('main')
.controller('projectsCtrl',['$scope','$http',function($scope,$http) {
	$http({method:'GET',url:'/projects'}).success(function(data) {
		$scope.projects = data;
	});
	// debugger;
}]);