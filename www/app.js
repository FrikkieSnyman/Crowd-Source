var app = angular.module('main', []);
app.controller('mainCtrl', function($scope) {
    $scope.firstName = "John";
    $scope.lastName = "Doe";
    $scope.name = "Piet";
});