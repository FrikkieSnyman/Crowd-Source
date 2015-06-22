angular.module('main')
.controller('porjectCtrl', ['$scope', '$http', '$routeParams',
	function($scope, $http, $routeParams) {
	var project = {'heading': $routeParams.id};
	$http({method:'POST', url:'/project', data: project}).success(function(data) {
		$scope.project = data[0];
		// Adding chlider to the project
		$scope.project.children = [];
		var childA = {name:'ChildA',description:'Child Description'};
		var childB = {name:'ChildB',description:'Child Description'};
		var childC = {name:'ChildC',description:'Child Description'};
		$scope.project.children.push(childA);
		$scope.project.children.push(childB);
		$scope.project.children.push(childC);
		//debugger;
	});
}]);
