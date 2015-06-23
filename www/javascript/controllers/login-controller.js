angular.module('main')
.controller('loginCtrl', ['$scope', '$http', function($scope, $http) {
	$scope.login = function() {
		var user = {'email': $scope.username, 'password': $scope.password};

		$http({method:'POST', url:'/login', data: user})
		.success(function (data) {
			console.log(data);
		});
	}

	
}]);
