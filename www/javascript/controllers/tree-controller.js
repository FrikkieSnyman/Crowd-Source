angular.module('main').
controller('TreeController', ['$scope', '$http', function($scope, $http) {
	$scope.delete = function(data) {
		data.nodes = [];
	};
	$scope.add = function(data) {
		var post = data.nodes.length + 1;
		var newName = data.name + '-' + post;
		data.nodes.push({name: newName, nodes: []});
		$scope.project.children = $scope.tree;
		$http({method:'POST', url:'/addChild', data: $scope.project});
	};
}]);
