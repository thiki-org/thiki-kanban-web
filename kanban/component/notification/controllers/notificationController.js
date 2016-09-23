/**
 * Created by xubt on 4/20/16.
 */

kanbanApp.controller('notificationController', ['$scope', 'notificationsService', 'localStorageService', '$uibModal',
    function ($scope, notificationsService, localStorageService, $uibModal) {

        var notificationsUrl = localStorageService.get("notificationsUrl");
        var notificationsPromise = notificationsService.loadNotifications(notificationsUrl);

        notificationsPromise.then(function (_data) {
            $scope.notifications = _data.notifications;
        });
    }]);
