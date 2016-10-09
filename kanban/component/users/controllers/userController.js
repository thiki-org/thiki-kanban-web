/**
 * Created by xubt on 4/20/16.
 */

kanbanApp.controller('userController', ['$scope', '$location', '$q', 'publicKeyServices', 'loginService', 'localStorageService', '$uibModal', 'notificationsService', 'usersService', '$interval', 'timerMessageService', '$rootScope',
    function ($scope, $location, $q, publicKeyServices, loginService, localStorageService, $uibModal, notificationsService, usersService, $interval, timerMessageService, $rootScope) {
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
                controller: "profileController",
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
