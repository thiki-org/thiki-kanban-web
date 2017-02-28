/**
 * Created by xubt on 4/20/16.
 */

kanbanApp.controller('registerController', ['$scope', '$location', '$q', 'publicKeyServices', 'registrationService', 'localStorageService', '$uibModalInstance', '$uibModal', 'timerMessageService',
    function ($scope, $location, $q, publicKeyServices, registrationService, localStorageService, $uibModalInstance, $uibModal, timerMessageService) {
        $scope.title = "注册";
        $scope.registerButtonText = "注册";
        $scope.isDisableRegisterButton = false;
        $scope.register = function () {
            $scope.registerButtonText = "注册中..";
            $scope.isDisableRegisterButton = true;
            var publicKeyPromise = publicKeyServices.loadPublicKey(localStorageService.get("publicKeyLink"));
            publicKeyPromise.then(function (_data) {
                var encrypt = new JSEncrypt();

                encrypt.setPublicKey(_data.publicKey);
                var encryptedPassword = encrypt.encrypt($scope.password);
                var registration = {
                    userName: $scope.userName,
                    email: $scope.email,
                    password: encryptedPassword
                };
                var registrationLink = _data._links.registration.href;
                var registrationPromise = registrationService.register(registration, registrationLink);
                registrationPromise.then(function (_data) {
                    timerMessageService.message("账号 " + _data.email + " 注册成功，请稍后自行登录。");
                    $uibModalInstance.dismiss('cancel');
                }).finally(function () {
                    $scope.registerButtonText = "注册";
                    $scope.isDisableRegisterButton = false;
                });
            });
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }]);
