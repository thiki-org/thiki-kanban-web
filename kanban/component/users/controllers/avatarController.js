/**
 * Created by xubt on 9/30/16.
 */

kanbanApp.controller('avatarController', ['$scope', '$location', '$q', 'publicKeyServices', 'loginService', 'localStorageService', '$uibModal', 'notificationsService', 'usersService', '$interval', 'timerMessageService', '$rootScope',
    function ($scope, $location, $q, publicKeyServices, loginService, localStorageService, $uibModal, notificationsService, usersService, $interval, timerMessageService, $rootScope) {
        $scope.title = '上传头像';
        $scope.uploadButtonText = "上传";
        $scope.ok = function () {
            localStorageService.clearAll();
            $uibModalInstance.close();
            $location.path("/welcome");
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.cropper = {};
        $scope.cropper.sourceImage = null;
        $scope.cropper.croppedImage = null;

        $scope.uploadAvatar = function () {
            $scope.uploadButtonText = "上传中..";
            var avatarLink = usersService.getCurrentUserProfile()._links.avatar.href;
            var avatarPromise = usersService.uploadAvatar(dataURItoBlob($scope.cropper.croppedImage), avatarLink);
            avatarPromise.then(function () {
                timerMessageService.message("头像设置成功。");
                $rootScope.avatar = $scope.cropper.croppedImage;
            }).finally(function () {
                $scope.uploadButtonText = "上传";
                $uibModalInstance.dismiss('cancel');
            });
        };
    }]);
