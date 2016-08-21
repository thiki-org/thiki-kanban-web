/**
 * Created by xubt on 4/20/16.
 */

kanbanApp.controller('timerMessageController', ['$scope', '$location', '$q', 'passwordService', '$interval', 'localStorageService', '$uibModalInstance', '$uibModal',
    function ($scope, $location, $q, passwordService, $interval, localStorageService, $uibModalInstance, $uibModal) {
        $scope.message = "找回密码成功,请用新密码登录。";
        $scope.timerMessage = "5秒后自动关闭";

        var count = 5;
        $scope.timer = $interval(function () {
            if (count === 0) {
                $interval.cancel($scope.timer);
                $uibModalInstance.dismiss('cancel');
            }
            else {
                $scope.timerMessage = count + "秒后自动关闭";
            }
            count--;
        }, 1000);
    }]);
