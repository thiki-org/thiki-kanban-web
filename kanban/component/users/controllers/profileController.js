/**
 * Created by xubt on 9/30/16.
 */

kanbanApp.controller('profileController', ['$scope', '$location', '$q', 'publicKeyServices', 'loginService', 'localStorageService', '$uibModal', 'notificationsService', 'usersService', '$interval', 'timerMessageService',
    function ($scope, $location, $q, publicKeyServices, loginService, localStorageService, $uibModal, notificationsService, usersService, $interval, timerMessageService) {
        $scope.title = '个人资料';
        $scope.ok = function () {
            localStorageService.clearAll();
            $uibModalInstance.close();
            $location.path("/welcome");
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.openAvatarUpload = function () {
            $uibModal.open({
                animation: false,
                templateUrl: 'component/users/partials/avatar-upload.html',
                controller: "avatarController",
                size: 'mid'
            });
        };
    }]);
