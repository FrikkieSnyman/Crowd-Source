'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus', '$location', '$mdSidenav', '$mdUtil', 'Headerpath',
	function($scope, Authentication, Menus, $location, $mdSidenav, $mdUtil, Headerpath) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.getHeaderPath = function() {
			var headerPath = $location.$$path;

			if (headerPath === '/') {
				headerPath = 'Welcome';
			} else {
				//Remove the first instance of /
				headerPath = headerPath.substring(headerPath.indexOf('/') + 1, headerPath.length);

				if (headerPath.indexOf('edit') !== -1 && headerPath.indexOf('projects') !== -1) {
					var projectID = headerPath.substring(headerPath.indexOf('projects') + 9, headerPath.indexOf('edit') - 1);

					headerPath = headerPath.replace(projectID, Headerpath.getProjectPath());

					headerPath = headerPath.substring(0, headerPath.indexOf('edit') - 1);
				} else if (headerPath.indexOf('reports') !== -1 && headerPath.indexOf('/') !== -1) {
					var reportID = headerPath.substring(headerPath.indexOf('reports') + 8, headerPath.length);

					headerPath = headerPath.replace(reportID, Headerpath.getReportPath());
				}

				var tokens = headerPath.split('/');
				headerPath = '';

				for (var i = 0; i < tokens.length; i++) {
					tokens[i] = capitalizeFirstLetter(tokens[i]);

					headerPath += tokens[i];
					if (i !== tokens.length - 1) {
						headerPath += ' > ';
					}
				}
			}

			return headerPath.trim();
		};

		var capitalizeFirstLetter = function(string) {
			return string.charAt(0).toUpperCase() + string.slice(1);
		};

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
