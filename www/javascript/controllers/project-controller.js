angular.module('main')
.controller('porjectCtrl', ['$scope','$http','$routeParams',function($scope, $http,$routeParams) {
	var project = Object;
	project.heading = $routeParams.id;
	$http({method:'GET',url:'/project/' + $routeParams.id, data:project }).success(function(data) {
	 	});
}]);