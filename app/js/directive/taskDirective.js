/**
 * Created by xubt on 5/26/16.
 */

kanbanApp.directive('tasks', function ($timeout) {
    return {
        restrict: 'E',
        templateUrl: 'partials/tasks.html',
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

kanbanApp.directive('taskCreation', function ($timeout) {
    return {
        restrict: 'E',
        templateUrl: 'partials/task-creation.html',
        controller: ['$scope', 'Tasks', function ($scope, Tasks) {

            var entry = $scope.entry;
            $scope.displayCreationButton = true;
            $scope.displayForm = false;
            $scope.showCreateTaskForm = function () {
                $scope.displayCreationButton = false;
                $scope.displayForm = true;
            };
            $scope.cancelCreateTask = function (entryId) {
                $scope.displayCreationButton = true;
                $scope.displayForm = false;
            };
            $scope.createTask = function () {
                var task = {summary: $scope.summary, entryId: entry.id};
                var taskPromise = Tasks.create(task, entry._links.tasks.href);
                taskPromise.then(function (data) {
                    var _tasksPromise = Tasks.loadTasksByEntryId(entry._links.tasks.href);

                    _tasksPromise.then(function (data) {
                        $scope.tasks = data;
                    });
                });
            };
        }]
    };
})


