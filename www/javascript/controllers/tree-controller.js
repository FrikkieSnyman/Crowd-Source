angular.module('main').
controller('TreeController', ['$scope', '$http', function($scope, $http) {
	$scope.delete = function(data) {
		$scope.searchTree($scope.project.children, data.$$hashKey, function() {
		});
	};
	$scope.add = function(data) {
		var post = data.nodes.length + 1;
		var newName = data.name + '-' + post;
		data.nodes.push({name: newName, nodes: []});
		$scope.project.children = $scope.tree;
		//$scope.save();
	}
	$scope.searchTree = function(node, id, callback) {
		//console.log
		var found = false;
		for (var i in node) {
			if (id === node[i].$$hashKey) {
				found = true;
				node.splice(i, 1);
				$scope.save();
			}
		}
		if (found === false) {
			for (i in node) {
				$scope.searchTree(node[i].nodes, id, function() {});
			}
		}
	};
	$scope.saveProject = function() {
		$http({method:'POST', url:'/addChild', data: $scope.project});
	}
}]);
