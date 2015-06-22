angular.module('main')
.controller('estimationCtrl', ['$scope', function($scope) {
	$scope.estimation = {
		project: '',
		estimator: ''
	};
}]);
