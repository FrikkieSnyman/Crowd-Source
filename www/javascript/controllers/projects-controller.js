angular.module('main')
.controller('projectsCtrl', ['$scope', '$http', '$location', '$mdDialog', function($scope, $http, $location, $mdDialog) {
	$http({method:'GET', url:'/projects'}).success(function(data) {
		$scope.projects = data;
	});

	$scope.createProject = function() {
		// console.log("Button press");
		$location.path('/createProject');
	};

	$scope.deleteProject = function(project) {

		var confirm = $mdDialog.confirm()
		.parent(angular.element(document.body))
		.title('Are you sure you wish to delete project ' + project.name + '?')
		.content('This will delete the project and prevent it from showing up in the list of projects.')
		.ariaLabel('Delete the project')
		.ok('Yes')
		.cancel('No');
		$mdDialog.show(confirm).then(function() {
			$http({method:'POST', url:'/deleteProject', data: project}).success(function() {
				$scope.updateProjects();
			});
		}, function() {
		});

	};

	$scope.updateProjects = function() {
		$http({method:'GET', url:'/projects'}).success(function(data) {
			$scope.projects = data;
		});
	};

	// debugger;
}]);
