/**
 * Created by xubt on 4/20/16.
 */

kanbanApp.controller('loginController', ['$scope', '$location', '$q', 'publicKeyServices', 'loginService', 'localStorageService', '$uibModalInstance',
    function ($scope, $location, $q, publicKeyServices, loginService, localStorageService, $uibModalInstance) {
        $scope.title = "登录";
        $scope.login = function () {
            var publicKeyPromise = publicKeyServices.loadPublicKey(localStorageService.get("publicKeyLink"));
            publicKeyPromise.then(function (_data) {
                var encrypt = new JSEncrypt();
                encrypt.setPublicKey(_data.publicKey);
                var identity = $scope.identity;
                var encryptedPassword = encrypt.encrypt($scope.password);

                var login = _data._links.login.href;
                var loginPromise = loginService.login(login, identity, encryptedPassword);
                loginPromise.then(function (_identity) {
                    alert("login success!" + JSON.stringify(_identity));
                    $uibModalInstance.dismiss('cancel');
                    localStorageService.clearAll();
                    localStorageService.set("identity.token", _identity.token);
                    localStorageService.set("identity.userName", _identity.userName);
                    $location.path('/users/' + _identity.userName + '/boards');
                });
            });
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }]);
