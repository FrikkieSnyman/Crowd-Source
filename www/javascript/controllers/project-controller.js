angular.module('main')
.controller('porjectCtrl', ['$scope', '$http', '$routeParams',
	function($scope, $http, $routeParams) {
	var project = {'heading': $routeParams.id};
	$http({method:'POST', url:'/project', data: project}).success(function(data) {
		$scope.project = data[0];
		// Adding chlider to the project
		$scope.project.children = [];
		var child = {name:'Child',description:'Child Description'};
		$scope.project.children.push(child);
		//debugger;
	});
}]);
