/**
 * Created by xubt on 5/26/16.
 */
kanbanApp.directive('tasks', function ($uibModal) {
    return {
        restrict: 'E',
        templateUrl: 'component/task/partials/tasks.html',
        replace: true,
        controller: ['$scope', '$routeParams', 'tasksServices', function ($scope, $routeParams, tasksServices) {
            loadTasks();
            function loadTasks() {
                var entry = $scope.entry;
                var _tasksPromise = tasksServices.loadTasksByEntryId(entry._links.tasks.href);

                _tasksPromise.then(function (data) {
                    $scope.tasks = data;
                    $scope.sortableOptions = {
                        connectWith: ".tasks",
                        opacity: 0.5,
                        start: function (e, ui) {
                            //   console.log("-----------" + $(ui.item.sortable.droptarget[0]).attr("entry"));
                            //alert(ui.item.sortable.model.id + ui.item.sortable.model.title);

                            console.log("staring sort.");
                        },
                        update: function (e, ui) {
                            console.log("updating sort.");

                        },
                        stop: function (e, ui) {
                            console.log("stopping sort.");

                            if (ui.item.sortable.droptarget == undefined) {
                                return;
                            }
                            var targetEntryId = $(ui.item.sortable.droptarget[0]).parent().attr("entryId");
                            ui.item.sortable.model.entryId = targetEntryId;
                            ui.item.sortable.model.orderNumber = ui.item.sortable.dropindex;
                            var _tasksPromise = tasksServices.update(ui.item.sortable.model);
                            _tasksPromise.then(function (data) {

                            });
                        }
                    };
                });
                $scope.open = function (_message, _link) {
                    $uibModal.open({
                        animation: false,
                        templateUrl: 'foundation/modal/partials/confirm-dialog.html',
                        controller: function ($scope, $uibModalInstance) {
                            $scope.title = '警告';
                            $scope.message = "确定要删除" + _message + "吗?";
                            $scope.ok = function () {
                                var _taskDeletePromise = tasksServices.deleteByLink(_link);
                                _taskDeletePromise.then(function () {
                                    loadTasks();
                                });
                                $uibModalInstance.close();
                            };
                            $scope.cancel = function () {
                                $uibModalInstance.dismiss('cancel');
                            };
                        },
                        size: 'sm'
                    });
                };
            }

            $scope.updateTask = function (_summary, _task) {
                var task = _task;
                task.summary = _summary;
                var taskPromise = tasksServices.update(task);
                taskPromise.then(function () {
                });
            }
        }]
    };
});


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
            }
        }]
    };
});


