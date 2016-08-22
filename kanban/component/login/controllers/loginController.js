/**
 * Created by xubt on 4/20/16.
 */

kanbanApp.controller('loginController', ['$scope', '$location', '$q', 'publicKeyServices', 'loginService', 'localStorageService', '$uibModalInstance', '$uibModal',
    function ($scope, $location, $q, publicKeyServices, loginService, localStorageService, $uibModalInstance, $uibModal) {
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
                    $uibModalInstance.dismiss('cancel');
                    localStorageService.clearAll();
                    localStorageService.set("identity.token", _identity.token);
                    localStorageService.set("identity.userName", _identity.userName);
                    localStorageService.set("user.links", _identity._links);

                    var currentPath = $location.path();

                    if (currentPath.indexOf("welcome")) {
                        $location.path(_identity.userName + '/boards');
                    }
                });
            });
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.keyPress = function ($event) {
            if ($scope.loginForm.$invalid) {
                return;
            }
            if ($event.keyCode == 13) {
                $scope.login();
            }
        };
        $scope.openForgetPasswordModal = function () {
            $uibModalInstance.dismiss('cancel');
            $uibModal.open({
                animation: true,
                templateUrl: 'component/password/partials/forget-password.html',
                controller: "passwordController",
                size: 'sm',
                backdrop: "static"
            });
        };
    }]);
