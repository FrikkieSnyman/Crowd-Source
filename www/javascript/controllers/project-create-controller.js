angular.module('main')
.controller('createProjectCtrl', ['$rootScope', '$scope', '$http', '$mdToast',
	function($rootScope, $scope, $http, $mdToast) {
	$scope.people = [];
	for (var i = $rootScope.users.length - 1; i >= 0; i--) {
		$scope.people[i] = $rootScope.users[i].email;
	};
	$scope.createProject = function() {
		var project = {'heading': $scope.projectName, 'description': $scope.description, 'owner' : $rootScope.currentUser, 'users' : $scope.selected};
		$http({method:'POST', url:'/createProject', data: project}).success(function(res) {
			if (res === false) {
				if (project.owner === '') {
					$mdToast.show(
					$mdToast.simple()
					.content('Need to be logged in to create a project')
					.position($scope.getToastPosition())
					.hideDelay(3000)
					);
				} else {
					$mdToast.show(
					$mdToast.simple()
					.content('There already exists a project with that name')
					.position($scope.getToastPosition())
					.hideDelay(3000)
					);
				}

			} else {
				$mdToast.show(
				$mdToast.simple()
				.content('Project created')
				.position($scope.getToastPosition())
				.hideDelay(3000)
				);
				$scope.goTo('/project/' + $scope.projectName);
			}
		});
	};
	$scope.getToastPosition = function() {
		return Object.keys($scope.toastPosition)
		.filter(function(pos) { return $scope.toastPosition[pos]; })
		.join(' ');
	};
	$scope.toastPosition = {
		bottom: true,
		top: false,
		left: false,
		right: true
	};

	$scope.selected = [];
	$scope.toggle = function(item, list) {
		var idx = list.indexOf(item);
		if (idx > -1) {
			list.splice(idx, 1);
		} else {
			list.push(item);
		}
	};

	$scope.exists = function(item, list) {
		return list.indexOf(item) > -1;
	};
}]);
