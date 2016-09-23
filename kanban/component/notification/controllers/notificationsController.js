/**
 * Created by xubt on 4/20/16.
 */

kanbanApp.controller('notificationsController', ['$scope', 'notificationsService', 'localStorageService', '$uibModal',
    function ($scope, notificationsService, localStorageService, $uibModal) {


        var loadNotifications = function () {
            var notificationsUrl = localStorageService.get("notificationsUrl");
            var notificationsPromise = notificationsService.loadNotifications(notificationsUrl);

            notificationsPromise.then(function (_data) {
                $scope.notifications = _data.notifications;
            });
        };

        loadNotifications();
    }]);
