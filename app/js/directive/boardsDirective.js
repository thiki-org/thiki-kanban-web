/**
 * Created by xubt on 5/26/16.
 */

kanbanApp.directive('board', function () {
    return {
        restrict: 'E',
        templateUrl: 'partials/board-banner.html',
        replace: true,
        controller: ['$scope', 'Tasks', function ($scope, Tasks) {
            var entry = $scope.entry;
            var _tasksPromise = Tasks.loadTasksByEntryId(entry._links.tasks.href);

            _tasksPromise.then(function (data) {
                $scope.tasks = data;
            });
        }]
    };
})
