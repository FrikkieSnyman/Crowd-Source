'use strict';

angular.module('sidenav').controller('SidenavController', ['$scope', '$http', '$mdDialog', '$location', 'Authentication' , 'Logindialog', '$mdUtil', '$mdSidenav', '$log',
	function($scope, $http, $mdDialog, $location, Authentication, Logindialog, $mdUtil, $mdSidenav, $log) {
		// Sidenav controller logic
		$scope.authentication = Authentication;

		$scope.signin = Logindialog.signin;
		$scope.signup = Logindialog.signup;
		$scope.forgotPass = Logindialog.forgotPass;

		var showAdvanced = function(ev) {
			$mdDialog.show({
				controller: DialogController,
				templateUrl: 'modules/sidenav/views/dialog.client.view.html',
				parent: angular.element(document.body),
				targetEvent: ev
			});
		};

		$scope.signinDialog = function(ev) {
			Logindialog.signin = true;
			Logindialog.signup = false;
			Logindialog.forgotPass = false;

			showAdvanced(ev);
		}

		$scope.signupDialog = function(ev) {
			Logindialog.signin = false;
			Logindialog.signup = true;
			Logindialog.forgotPass = false;

			showAdvanced(ev);
		}

		$scope.toggleLeft = buildToggler('left');
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

		$scope.go = function(path) {
			$location.path(path);
		};

		$scope.signOut = function() {
			$http.get('/auth/signout').success(function(response) {
				$location.path(response);
			});

			$http.get('/auth/signout').success(function(response) {
				// If successful we assign null to the global user model
				$scope.authentication.user = null;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				// $scope.error = response.message;
			});
		}
	}
])
.controller('LeftCtrl', function ($scope, $timeout, $mdSidenav, $log) {
	$scope.close = function () {
	  $mdSidenav('left').close()
		.then(function () {
		  $log.debug("close LEFT is done");
		});
	};
});

function DialogController($scope, $mdDialog) {
	$scope.hide = function() {
		$mdDialog.hide();
	};
	$scope.cancel = function() {
		$mdDialog.cancel();
	};
}
