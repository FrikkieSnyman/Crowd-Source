'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus', '$location', '$mdSidenav', '$mdUtil',
	function($scope, Authentication, Menus, $location, $mdSidenav, $mdUtil) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});

		$scope.goTo = function(route) {
			$location.path(route);
		};

		$scope.sidenav = $mdSidenav;
		function buildToggler(navID) {
			var debounceFn =  $mdUtil.debounce(function() {
				$mdSidenav(navID)
				.toggle()
        .then(function() {
        });
			}, 300);
			return debounceFn;
		}
		$scope.toggleLeft = buildToggler('left');

	}
]);
