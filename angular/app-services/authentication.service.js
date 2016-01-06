(function () {
    'use strict';

    angular
        .module('app')
        .factory('AuthenticationService', AuthenticationService);

    AuthenticationService.$inject = ['$http', '$cookieStore', '$rootScope', '$timeout', 'UserService'];
    function AuthenticationService($http, $cookieStore, $rootScope, $timeout, UserService) {
        var service = {};

        service.Login = Login;
        service.SetCredentials = SetCredentials;
        service.ClearCredentials = ClearCredentials;

        return service;

        function Login(userData, callback) {

            /* Dummy authentication for testing, uses $timeout to simulate api call
             ----------------------------------------------*/
            $timeout(function () {
                var response;
                UserService.GetByUsername(userData.username)
                    .then(function (user) {
                        if (user !== null && user.password === userData.password) {
                            response = { success: true };
                        } else {
                            response = { success: false, message: 'Username or password is incorrect' };
                        }
                        callback(response);
                    });
            }, 1000);

            /* Use this for real authentication
             ----------------------------------------------*/
            //$http.post('/api/authenticate', userData)
            //    .success(function (response) {
            //        callback(response);
            //    });

        }

        function SetCredentials(userData) {
            var authdata = Base64.encode(userData.username + ':' + userData.password + ':' + userData.rememberMe);

            $rootScope.globals = {
                currentUser: {
                    username: userData.username,
                    authdata: authdata
                }
            };

            $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata; // jshint ignore:line
            $cookieStore.put('globals', $rootScope.globals);
        }

        function ClearCredentials() {
            $rootScope.globals = {};
            $cookieStore.remove('globals');
            $http.defaults.headers.common.Authorization = 'Basic';
        }
    }

})();