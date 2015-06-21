
angular
.module('main',['ngMaterial','ngRoute'])
.config(function($mdThemingProvider) {
  $mdThemingProvider.definePalette('amazingPaletteName', {
    '50': 'ffebee',
    '100': 'ffcdd2',
    '200': 'ef9a9a',
    '300': 'e57373',
    '400': 'ef5350',
    '500': 'f44336',
    '600': 'e53935',
    '700': 'd32f2f',
    '800': 'c62828',
    '900': 'b71c1c',
    'A100': 'ff8a80',
    'A200': 'ff5252',
    'A400': 'ff1744',
    'A700': 'd50000',
    'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
                                        // on this palette should be dark or light
    'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
     '200', '300', '400', 'A100'],
    'contrastLightColors': undefined    // could also specify this if default was 'dark'
  });
  $mdThemingProvider.theme('default')
    .primaryPalette('amazingPaletteName')
})
.config(function($routeProvider){
	$routeProvider.when('/project',{
		templateUrl: 'templates/pages/project/index.html'
	});
	$routeProvider.when('/',{
		templateUrl: 'templates/pages/main/index.html'
	})
})
.controller('mainCtrl', function ($scope, $timeout, $mdSidenav, $mdUtil, $log) {
	$scope.toggleLeft = buildToggler('left');
	// $scope.toggleRight = buildToggler('right');

	/**
	 * Build handler to open/close a SideNav; when animation finishes
	 * report completion in console
	 */
	function buildToggler(navID) {
		var debounceFn =  $mdUtil.debounce(function(){
					$mdSidenav(navID)
						.toggle()
						.then(function () {
							$log.debug("toggle " + navID + " is done");
						});
				},300);

		return debounceFn;
	}
})
.controller('LeftCtrl', function ($scope, $timeout, $mdSidenav, $log) {
	$scope.close = function () {
		$mdSidenav('left').close()
			.then(function () {
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
