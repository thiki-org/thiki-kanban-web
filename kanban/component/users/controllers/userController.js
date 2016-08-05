/**
 * Created by xubt on 4/20/16.
 */

kanbanApp.controller('userController', ['$scope', '$location', '$q', 'publicKeyServices', 'loginService', 'localStorageService', '$uibModal',
    function ($scope, $location, $q, publicKeyServices, loginService, localStorageService, $uibModal) {
        $scope.loginOut = function () {
            console.log("即将退出。。。");
            $uibModal.open({
                animation: false,
                templateUrl: 'foundation/modal/partials/confirm-dialog.html',
                controller: function ($scope, $uibModalInstance) {
                    $scope.title = '确认';
                    $scope.message = "确定要退出登录吗?";
                    $scope.ok = function () {
                        localStorageService.clearAll();
                        $uibModalInstance.close();
                        $location.path("/welcome");
                    };
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                size: 'sm'
            });
        };
    }]);
