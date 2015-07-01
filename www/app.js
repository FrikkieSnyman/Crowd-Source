angular
.module('main', ['ngMaterial', 'ngRoute', 'ui.tree'])
.run(function($rootScope, $location) {
	$rootScope.currentUser = '';

	$rootScope.location = $location;
	$rootScope.getPath = function() {
		var path = $location.path();
		path = path.replace('/', ">");
		path = path.substring(1);
		path = path.toUpperCase();
		return path;
	};
})
.config(function($httpProvider) {
	$httpProvider.interceptors.push('tokenInterceptor');
})
.config(function($mdThemingProvider) {
	$mdThemingProvider.theme('default')
	.primaryPalette('indigo')
	.accentPalette('yellow');
})
.config(function($routeProvider) {
	$routeProvider.when('/projects', {
		templateUrl: 'templates/pages/projects/index.html'
	});
	$routeProvider.when('/project/:id', {
		templateUrl: 'templates/pages/project/project.html',
	})
	$routeProvider.when('/createProject', {
		templateUrl: 'templates/pages/project/index.html'
	});
	$routeProvider.when('/', {
		templateUrl: 'templates/pages/main/index.html'
	});
	$routeProvider.when('/estimation', {
		templateUrl: 'templates/pages/estimation/index.html'
	})
})
.controller('mainCtrl', function($scope, $timeout, $mdSidenav, $mdDialog, $mdUtil, $log, $location, $http) {
	$scope.toggleLeft = buildToggler('left');
	$scope.goTo = function(newPath) {
		$location.path(newPath);
	};
	$scope.onProjects = function() {
		return $location.path() === '/projects';
	};
	$scope.createProject = function() {
		// $http({method:'POST', url:'/getUsers', data: $scope}).succes(function() {

		// });
		$http.get('/getUsers').success(function(res){
			console.log(res);
		});

	};
	// $scope.toggleRight = buildToggler('right');

	/**
	 * Build handler to open/close a SideNav; when animation finishes
	 * report completion in console
	 */
	function buildToggler(navID) {
		var debounceFn =  $mdUtil.debounce(function() {
			$mdSidenav(navID)
				.toggle()
				.then(function() {
					$log.debug("toggle " + navID + " is done");
				});
		}, 300);

		return debounceFn;
	}
})
.controller('LeftCtrl', function($scope, $timeout, $mdSidenav, $log) {
	$scope.close = function() {
		$mdSidenav('left').close()
		.then(function() {
			$log.debug("close LEFT is done");
		});
	};
});
