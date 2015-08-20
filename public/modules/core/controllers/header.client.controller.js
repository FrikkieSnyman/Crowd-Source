'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$http', 'Authentication', 'Menus', '$location', '$mdSidenav', '$mdUtil', 'RESOURCE_DOMAIN',
	function($scope, $http, Authentication, Menus, $location, $mdSidenav, $mdUtil, RESOURCE_DOMAIN) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.getHeaderPath = function() {
			var headerPath = $location.$$path;

			if (headerPath === "/") {
				headerPath = "Welcome";
			} else if (headerPath.indexOf("edit") !== -1 && headerPath.indexOf("projects")) {
				var projectID = headerPath.substring(headerPath.indexOf("projects") + 9, headerPath.indexOf("edit") - 1);

				
			} else {
				var tokens = headerPath.split("/");
				headerPath = "";

				for (var i = 0; i < tokens.length; i++) {
					tokens[i] = capitalizeFirstLetter(tokens[i]);

					headerPath += tokens[i];
					headerPath += " > ";
				};

				//Remove the first instance of >
				headerPath = headerPath.substring(headerPath.indexOf(">") + 1, headerPath.length - 3);
			}

			return headerPath.trim();
		}

		var capitalizeFirstLetter = function(string) {
			return string.charAt(0).toUpperCase() + string.slice(1);
		}

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

		$scope.onProjects = function() {
			// console.log($location);
			return $location.path() === '/projects';
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
