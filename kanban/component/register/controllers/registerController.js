/**
 * Created by xubt on 4/20/16.
 */

kanbanApp.controller('registerController', ['$scope', '$location', '$q', 'publicKeyServices', 'registrationService', 'localStorageService', '$uibModal',
    function ($scope, $location, $q, publicKeyServices, registrationService, localStorageService, $uibModal) {
        $scope.title = "注册";
        $scope.register = function () {
            var publicKeyPromise = publicKeyServices.loadPublicKey(localStorageService.get("publicKeyLink"));
            publicKeyPromise.then(function (_data) {
                var encrypt = new JSEncrypt();

                encrypt.setPublicKey(_data.publicKey);
                var encryptedPassword = encrypt.encrypt($scope.password);
                var registration = {
                    name: $scope.name,
                    email: $scope.email,
                    password: encryptedPassword
                };
                var registrationLink = _data._links.registration.href;
                var registrationPromise = registrationService.register(registration, registrationLink);
                registrationPromise.then(function (_data) {
                    alert("success!");
                });
            });
        };
    }]);
