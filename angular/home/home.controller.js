(function () {
    'use strict';

    angular
        .module('app')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['SignUpService', '$rootScope'];
    function HomeController(SignUpService, $rootScope) {
        var vm = this;
        vm.user = null;
        vm.allUsers = [];

        initController();

        function initController() {
            loadCurrentUser();
            loadAllUsers();
        }

        function loadCurrentUser() {
            SignUpService.GetByUsername($rootScope.globals.currentUser.username)
                .then(function (user) {
                    vm.user = user;
                });
        }

        function loadAllUsers() {
            SignUpService.GetAll()
                .then(function (users) {
                    vm.allUsers = users;
                });
        }
    }

})();