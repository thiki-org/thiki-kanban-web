/**
 * Created by xubt on 4/20/16.
 */

kanbanApp.controller('passwordController', ['$scope', '$location', '$q', 'passwordService', '$interval', 'localStorageService', '$uibModalInstance',
    function ($scope, $location, $q, passwordService, $interval, localStorageService, $uibModalInstance) {
        $scope.title = "找回密码";
        $scope.sendVerificationCodeButtonText = "发送验证码";
        $scope.sendPasswordRetrievalApplication = function () {
            $scope.isDisableSendVerificationCodeButton = true;
            $scope.sendVerificationCodeButtonText = "发送中...";
            var retrievalApplication = {email: $scope.email};
            var passwordRetrievalApplicationLink = localStorageService.get("entranceData")._links.passwordRetrievalApplication.href;
            var retrievalApplicationPromise = passwordService.retrievalApplication(passwordRetrievalApplicationLink, retrievalApplication);
            retrievalApplicationPromise.then(function (_data) {

                var count = 60;
                $scope.timer = $interval(function () {
                    if (count == 0) {
                        $interval.cancel($scope.timer);
                        $scope.isDisableSendVerificationCodeButton = false;
                        $scope.sendVerificationCodeButtonText = "发送验证码";
                    }
                    else {
                        $scope.isDisableSendVerificationCodeButton = true;
                        $scope.sendVerificationCodeButtonText = count + "秒后再发送";
                    }
                    count--;
                }, 1000);
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
            $uibModal.open({
                animation: true,
                templateUrl: 'component/password/partials/forget-password.html',
                controller: "loginController",
                size: 'sm'
            });
        };
    }]);
