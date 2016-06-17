/**
 * Created by xubt on 5/26/16.
 */
angular.module('kanbanApp').controller('ModalInstanceCtrl', function ($scope, $uibModalInstance) {
    $scope.ok = function () {
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});
kanbanApp.directive('taskCreation', function ($timeout) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'component/task/partials/task-creation.html',
        controller: ['$scope', 'tasksServices', function ($scope, tasksServices) {

            var entry = $scope.entry;
            $scope.displayCreationButton = true;
            $scope.displayForm = false;
            $scope.showCreateTaskForm = function () {
                $scope.displayCreationButton = false;
                $scope.displayForm = true;
                $scope.summary = "";
            };
            $scope.cancelCreateTask = function () {
                $scope.displayCreationButton = true;
                $scope.displayForm = false;
            };
            $scope.createTask = function () {
                var task = {summary: $scope.summary, entryId: entry.id};
                var taskPromise = tasksServices.create(task, entry._links.tasks.href);
                taskPromise.then(function (data) {
                    var _tasksPromise = tasksServices.loadTasksByEntryId(entry._links.tasks.href);

                    _tasksPromise.then(function (data) {
                        $scope.tasks = data;
                        $scope.displayCreationButton = true;
                        $scope.displayForm = false;
                    });
                });
            };
            $scope.keyPress = function ($event) {
                if ($event.keyCode == 13) {
                    $scope.createTask();
                }
                if ($event.keyCode == 27) {
                    $scope.cancelCreateTask();
                }
            };
            $scope.blur = function () {
                if ($scope.summary == "") {
                    $scope.displayCreationButton = true;
                    $scope.displayForm = false;
                }
            }
        }]
    };
});

