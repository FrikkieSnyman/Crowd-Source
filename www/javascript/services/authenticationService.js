angular.module('main')
.factory('authenticationService', function() {
    var auth = {
        isLogged: false
    }
 
    return auth;
});
