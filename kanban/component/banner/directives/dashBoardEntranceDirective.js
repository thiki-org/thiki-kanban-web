/**
 * Created by xubt on 5/26/16.
 */

kanbanApp.directive('dashboardEntrance', function () {
    return {
        restrict: 'E',
        templateUrl: 'component/banner/partials/dashboard-entrance.html',
        replace: true,
        transclude: true,
        controller: ['$scope', '$location', 'boardsService', 'localStorageService', '$uibModal', function ($scope, $location, boardsService, localStorageService, $uibModal) {
            var dashboardLink = localStorageService.get("identity.userName") + '/dashboard';
            $scope.toDashBoard = function () {
                $location.path(dashboardLink);
            };
        }]
    };
});
