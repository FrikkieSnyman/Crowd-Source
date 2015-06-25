angular.module('main').
controller('TreeController', ['$scope', '$http', '$mdDialog', function($scope, $http, $mdDialog) {
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
				//$scope.save();
			}
		}
		if (found === false) {
			for (i in node) {
				$scope.searchTree(node[i].nodes, id, function() {});
			}
		}
	};
<<<<<<< HEAD
	$scope.showConfirm = function(ev, data) {
		// Appending dialog to document.body to cover sidenav in docs app
		var confirm = $mdDialog.confirm()
		.parent(angular.element(document.body))
		.title('Are you sure you want to delete the node?')
		.content('')
		.ariaLabel('Delete node')
		.ok('Yes')
		.cancel('No')
		.targetEvent(ev);
		$mdDialog.show(confirm).then(function() {
			$scope.delete(data);
		}, function() {
			
		});
=======
	$scope.save = function() {
		$http({method:'POST', url:'/addChild', data: $scope.project});
>>>>>>> master
	};
}]);
