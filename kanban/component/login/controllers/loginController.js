/**
 * Created by xubt on 4/20/16.
 */

kanbanApp.controller('loginController', ['$scope', '$location', '$q', 'publicKeyServices', 'loginService', 'localStorageService', '$uibModalInstance', '$uibModal', 'timerMessageService', 'toaster',
    function ($scope, $location, $q, publicKeyServices, loginService, localStorageService, $uibModalInstance, $uibModal, timerMessageService, toaster) {
        $scope.title = "登录";
        $scope.isDisableLoginButton = false;
        $scope.loginButtonText = "登录";
        $scope.login = function () {
            $scope.isDisableLoginButton = true;
            $scope.loginButtonText = "登录中..";
            var publicKeyPromise = publicKeyServices.loadPublicKey(localStorageService.get("publicKeyLink"));
            publicKeyPromise.then(function (_data) {
                var encrypt = new JSEncrypt();
                encrypt.setPublicKey(_data.publicKey);
                var identity = $scope.identity;
                var encryptedPassword = encrypt.encrypt($scope.password);

                var login = _data._links.login.href;
                var loadingInstance = timerMessageService.loading();
                loginService.login(login, identity, encryptedPassword).then(function (_identity) {
                    $uibModalInstance.dismiss('cancel');
                    localStorageService.clearAll();
                    localStorageService.set("identity.token", _identity.token);
                    localStorageService.set("identity.userName", _identity.userName);
                    localStorageService.set("user.links", _identity._links);
                    localStorageService.set("currentUser", _identity);

                    var currentPath = $location.path();

                    if (currentPath.indexOf("welcome")) {
                        $location.path(_identity.userName + '/boards');
                    }
                }).finally(function () {
                    $scope.isDisableLoginButton = false;
                    $scope.loginButtonText = "登录";
                    timerMessageService.close(loadingInstance);
                });
            });
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
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

        $scope.register = function () {
            $uibModal.open({
                animation: true,
                templateUrl: 'component/register/partials/register.html',
                controller: "registerController",
                size: 'sm',
                backdrop: "static"
            });
        };
    }]);
