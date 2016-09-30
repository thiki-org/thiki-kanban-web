/**
 * Created by xubt on 9/30/16.
 */

kanbanApp.controller('avatarController', ['$scope', '$location', '$q', 'publicKeyServices', 'loginService', 'localStorageService', '$uibModal', 'notificationsService', 'usersService', '$interval', 'timerMessageService',
    function ($scope, $location, $q, publicKeyServices, loginService, localStorageService, $uibModal, notificationsService, usersService, $interval, timerMessageService) {
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
            var avatarPromise = usersService.uploadAvatar(dataURItoBlob($scope.cropper.croppedImage), "http://localhost:8080/users/xutao/avatar");
            avatarPromise.then(function () {
                timerMessageService.message("头像设置成功。");
            }).finally(function () {
                $scope.uploadButtonText = "上传";
                $uibModalInstance.dismiss('cancel');
            });
        };
    }]);

kanbanApp.directive('fileUpload', function () {
    return {
        scope: true,        //create a new scope
        link: function (scope, el, attrs) {
            el.bind('change', function (event) {
                var files = event.target.files;
                //iterate files since 'multiple' may be specified on the element
                for (var i = 0; i < files.length; i++) {
                    //emit event upward
                    scope.$emit("fileSelected", {file: files[i]});
                }
            });
        }
    };
});
String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};
