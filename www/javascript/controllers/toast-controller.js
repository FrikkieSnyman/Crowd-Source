angular.module('main')
.controller('ToastCtrl', function($scope, $mdToast) {
	$scope.closeToast = function() {
		$mdToast.hide();
	};
});
