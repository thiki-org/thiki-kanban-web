/**
 * Created by xubt on 9/23/16.
 */

kanbanApp.directive('notification', function () {
    return {
        restrict: 'E',
        templateUrl: 'component/notification/partials/notification.html',
        replace: true,
        controller: ['$scope', '$location', 'notificationsService', 'localStorageService', '$uibModal', function ($scope, $location, notificationsService, localStorageService, $uibModal) {
            $scope.readNotification = function () {
                var notificationPromise = notificationsService.loadNotificationByLink($scope.notification._links.self.href);
                notificationPromise.then(function (_data) {
                    $scope.notification = _data;
                });
            }
        }]
    };
});
