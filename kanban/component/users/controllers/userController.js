/**
 * Created by xubt on 4/20/16.
 */

kanbanApp.controller('userController', ['$scope', '$location', '$q', 'publicKeyServices', 'loginService', 'localStorageService', '$uibModal', 'notificationsService', 'usersService', '$interval',
    function ($scope, $location, $q, publicKeyServices, loginService, localStorageService, $uibModal, notificationsService, usersService, $interval) {
        $scope.userName = localStorageService.get("identity.userName");

        var unreadNotificationsTotalLink = usersService.getCurrentUser()._links.unreadNotificationsTotal.href;
        var pollNotifications = $interval(function () {
            var notificationPromise = notificationsService.loadUnreadNotificationsTotal(unreadNotificationsTotalLink);
            notificationPromise.then(function (_data) {
                $scope.unreadNotificationsTotal = _data.unreadNotificationsTotal;
                $scope.isShowNotification = $scope.unreadNotificationsTotal === 0 ? false : true;
                localStorageService.set("notificationsUrl", _data._links.notifications.href);
            }, function () {
                $interval.cancel(pollNotifications);
            });
        }, 5000);

        $scope.gotoTeams = function () {
            $location.path(localStorageService.get('identity.userName') + "/teams");
        };
        $scope.openNotifications = function () {
            $location.path(usersService.getCurrentUser().userName + "/notifications");
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
