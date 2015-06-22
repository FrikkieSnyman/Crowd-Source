
angular
.module('main', ['ngMaterial', 'ngRoute'])
.config(function($mdThemingProvider) {
	$mdThemingProvider.theme('default')
    .primaryPalette('indigo')
    .accentPalette('yellow');
})
.config(function($routeProvider) {
	$routeProvider.when('/createProject', {
		templateUrl: 'templates/pages/project/index.html'
	});
	$routeProvider.when('/', {
		templateUrl: 'templates/pages/main/index.html'
	})
})
.controller('mainCtrl', function($scope, $timeout, $mdSidenav, $mdUtil, $log, $location) {
	$scope.toggleLeft = buildToggler('left');
	$scope.gotToMainPage = function() {
		$location.path("/");
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
})
.controller('ListCtrl', function($scope, $mdDialog) {
	$scope.navigateTo = function(to, event) {
		$mdDialog.show(
		$mdDialog.alert()
			.title('Navigating')
			.content('Imagine being taken to ' + to)
			.ariaLabel('Navigation demo')
			.ok('Neat!')
			.targetEvent(event)
		);
	};
 });
