/**
 * Created by xubt on 4/20/16.
 */

kanbanApp.controller('notificationsController', ['$scope', 'notificationsService', 'localStorageService', 'timerMessageService',
    function ($scope, notificationsService, localStorageService, timerMessageService) {


        var loadNotifications = function () {
            var notificationsUrl = localStorageService.get("notificationsUrl");
            $scope.loadingInstance = timerMessageService.loading();
            notificationsService.loadNotifications(notificationsUrl)
                .then(function (_data) {
                    $scope.notifications = _data.notifications;
                }).finally(function () {
                timerMessageService.close($scope.loadingInstance);
            });
        };
        loadNotifications();
    }]);
