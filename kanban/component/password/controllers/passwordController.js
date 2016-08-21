/**
 * Created by xubt on 4/20/16.
 */

kanbanApp.controller('passwordController', ['$scope', '$location', '$q', 'passwordService', '$interval', 'localStorageService', '$uibModalInstance', '$uibModal',
    function ($scope, $location, $q, passwordService, $interval, localStorageService, $uibModalInstance, $uibModal) {
        $scope.title = "找回密码";
        $scope.sendVerificationCodeButtonText = "发送验证码";
        var passwordResetApplicationLink;
        $scope.sendPasswordRetrievalApplication = function () {
            $scope.isDisableSendVerificationCodeButton = true;
            $scope.sendVerificationCodeButtonText = "发送中...";
            var retrievalApplication = {email: $scope.email};
            var passwordRetrievalApplicationLink = localStorageService.get("entranceData")._links.passwordRetrievalApplication.href;
            var retrievalApplicationPromise = passwordService.retrievalApplication(passwordRetrievalApplicationLink, retrievalApplication);
            retrievalApplicationPromise.then(function (_data) {
                passwordResetApplicationLink = _data._links.passwordResetApplication.href;
                var count = 60;
                $scope.timer = $interval(function () {
                    if (count === 0) {
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
            }, function () {
                $scope.isDisableSendVerificationCodeButton = false;
                $scope.sendVerificationCodeButtonText = "发送验证码";
            });

        };
        $scope.applyReset = function () {
            var resetApplication = {email: $scope.email, verificationCode: $scope.verificationCode};
            var resetPromise = passwordService.applyReset(passwordResetApplicationLink, resetApplication);
            resetPromise.then(function (_data) {
                $uibModalInstance.dismiss('cancel');
                $uibModal.open({
                    animation: true,
                    templateUrl: 'component/password/partials/password-reset.html',
                    controller: "passwordController",
                    size: 'sm'
                });
            });
        };

        $scope.resetPassword = function () {
            $uibModalInstance.dismiss('cancel');
            $uibModal.open({
                animation: true,
                templateUrl: 'component/password/partials/tip-dialog.html',
                controller: "timerMessageController",
                size: 'sm'
            });
        };
    }]);
