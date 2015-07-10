angular.module('main')
.controller('projectsCtrl', ['$scope', '$http', '$location', '$mdDialog', '$timeout', function($scope, $http, $location, $mdDialog, $timeout) {
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
			$timeout(function() {
				$http({method:'POST', url:'/deleteProject', data: project}).success(function() {
					$scope.updateProjects();
				});
			});
				//debugger;
		}, function() {
		});
	};
	$scope.updateProjects = function() {
		$http({method:'GET', url:'/projects'}).success(function(data) {
			$scope.projects = data;
		});
	};

	$scope.querySearch = function(query) {
		//console.log(query);
		var results = query ? $scope.projects.filter(createFilterFor(query)) : $scope.projects, deferred;
		return results;
	};

	$scope.searchTextChange = function(text) {
		console.log('Text changed to ' + text);
	};

	$scope.selectedItemChange = function(item)
	{
		$scope.goTo('/project/' + item.name);
	}

	var createFilterFor = function(query) {
		var lowercaseQuery = angular.lowercase(query);
		return function filterFn(item) {
			//console.log(item);
			var name = angular.lowercase(item.name);
			return (name.indexOf(lowercaseQuery) === 0);
		};
	}

	// debugger;
}]);
