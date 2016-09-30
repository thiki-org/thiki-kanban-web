/**
 * Created by xubt on 4/20/16.
 */

kanbanApp.controller('userController', ['$scope', '$location', '$q', 'publicKeyServices', 'loginService', 'localStorageService', '$uibModal', 'notificationsService', 'usersService', '$interval',
    function ($scope, $location, $q, publicKeyServices, loginService, localStorageService, $uibModal, notificationsService, usersService, $interval) {
        $scope.userName = localStorageService.get("identity.userName");

        var unreadNotificationsTotalLink = usersService.getCurrentUser()._links.unreadNotificationsTotal.href;
        var pollNotifications = $interval(function () {
            if ($location.path() === "/welcome") {
                $interval.cancel(pollNotifications);
            }
            loadUnreadNotificationTotal();
        }, 5000);

        loadUnreadNotificationTotal();

        function loadUnreadNotificationTotal() {
            var notificationPromise = notificationsService.loadUnreadNotificationsTotal(unreadNotificationsTotalLink);
            notificationPromise.then(function (_data) {
                $scope.unreadNotificationsTotal = _data.unreadNotificationsTotal;
                $scope.isShowNotification = $scope.unreadNotificationsTotal === 0 ? false : true;
                localStorageService.set("notificationsUrl", _data._links.notifications.href);
            }, function () {
                $interval.cancel(pollNotifications);
            });
        }

        $scope.gotoTeams = function () {
            $location.path(localStorageService.get('identity.userName') + "/teams");
        };
        $scope.openNotifications = function () {
            $location.path(usersService.getCurrentUser().userName + "/notifications");
        };
        $scope.openProfile = function () {
            $uibModal.open({
                animation: false,
                templateUrl: 'component/users/partials/profile.html',
                controller: function ($scope, $uibModalInstance) {
                    $scope.title = '个人资料';
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
                    function dataURItoBlob(dataURI) {
                        var binary = atob(dataURI.split(',')[1]);
                        var array = [];
                        for (var i = 0; i < binary.length; i++) {
                            array.push(binary.charCodeAt(i));
                        }
                        return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
                    }

                    $scope.uploadAvatar = function () {
                        usersService.uploadAvatar(dataURItoBlob($scope.cropper.croppedImage), "http://localhost:8080/users/xutao/avatar");
                    };
                },
                size: 'lg'
            });
        };

        $scope.loginOut = function () {
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
