/**
 * Created by xubt on 5/26/16.
 */
kanbanApp.directive('tasks', function ($uibModal) {
    return {
        restrict: 'E',
        templateUrl: 'component/task/partials/tasks.html',
        replace: true,
        controller: ['$scope', '$routeParams', 'tasksServices', 'localStorageService', 'assignmentServices', function ($scope, $routeParams, tasksServices, localStorageService, assignmentServices) {
            $scope.loadTasks = function () {
                var entry = $scope.entry;
                var _tasksPromise = tasksServices.loadTasksByEntryId(entry._links.tasks.href);

                _tasksPromise.then(function (data) {
                    $scope.tasks = data;
                    $scope.sortableOptions = {
                        connectWith: ".tasks",
                        opacity: 0.5,
                        placeholder: "task-drag-placeholder",
                        start: function (e, ui) {
                            console.log("staring sort.");
                        },
                        update: function (e, ui) {
                            console.log("updating sort.");

                        },
                        stop: function (e, ui) {
                            console.log("stopping sort.");

                            if (ui.item.sortable.droptarget === undefined) {
                                return;
                            }
                            var targetEntryId = $(ui.item.sortable.droptarget[0]).parent().attr("entryId");
                            if (targetEntryId == ui.item.sortable.model.entryId) {
                                return;
                            }
                            ui.item.sortable.model.entryId = targetEntryId;
                            ui.item.sortable.model.orderNumber = ui.item.sortable.dropindex;
                            var _tasksPromise = tasksServices.update(ui.item.sortable.model);
                            _tasksPromise.then(function (data) {

                            });
                        }
                    };
                });
            };

            $scope.mouseover = function () {
                $scope.isShowTaskCreationButton = true;
            };

            $scope.onMouseLeave = function () {
                $scope.isShowTaskCreationButton = false;
            };

            $scope.loadTasks();
        }]
    };
});
