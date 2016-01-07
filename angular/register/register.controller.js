(function () {
    'use strict';

    angular
        .module('app')
        .controller('RegisterController', RegisterController);

    RegisterController.$inject = ['SignUpService', '$location', '$rootScope', 'FlashService'];
    function RegisterController(SignUpService, $location, $rootScope, FlashService) {
        var vm = this;

        vm.register = register;
        vm.data = [];

        initController();

        function initController() {
            vm.dataLoading = true;
            SignUpService.getSignUpRoot()
                .then(function(response){
                    vm.data = response;
                });
        }

        function register() {
            vm.dataLoading = true;
            var formData = {username : vm.username, password: vm.password, rememberMe:vm.rememberMe};
            SignUpService.Create(formData)
                .then(function (response) {
                    if (response.success) {
                        FlashService.Success('Registration successful', true);
                        $location.path('/user/type');
                    } else {
                        FlashService.Error(response.message);
                        vm.dataLoading = false;
                    }
                });
        }
    }

})();
