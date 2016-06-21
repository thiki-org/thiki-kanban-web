/**
 * Created by xubt on 6/17/16.
 */
kanbanApp.directive('task', function ($uibModal) {
    return {
        restrict: 'E',
        templateUrl: 'component/task/partials/task.html',
        replace: true,
        transclude: true,
        scope: {
            task: '='
        },
        controller: ['$scope', 'localStorageService', 'assignmentServices', 'tasksServices', function ($scope, localStorageService, assignmentServices, tasksServices) {
            $scope.assign = function (_task) {
                var thisScope = $scope;
                $uibModal.open({
                    animation: false,
                    templateUrl: 'component/task/partials/assignment-confirm.html',
                    controller: function ($scope, $uibModalInstance) {
                        $scope.title = '确认信息';
                        if (thisScope.isIamAssigned) {
                            $scope.message = "你确定不再做该任务吗?";
                            $scope.ok = function () {
                                var userId = localStorageService.get("userId");
                                var myAssignmentLink;
                                angular.forEach(thisScope.assignments, function (_assignment) {
                                    if (userId === _assignment.assignee) {
                                        myAssignmentLink = _assignment._links.self.href;
                                        return;
                                    }
                                });
                                var assignmentPromise = assignmentServices.giveUp(myAssignmentLink);
                                assignmentPromise.then(function (_data) {
                                    thisScope.loadAssignments();
                                });
                                $uibModalInstance.close();
                            };
                        }
                        else {
                            $scope.message = "你确定要认领该任务吗?";
                            $scope.ok = function () {
                                var assignment = {
                                    taskId: _task.id,
                                    assignee: localStorageService.get("userId"),
                                    assigner: localStorageService.get("userId")
                                };

                                var assignmentPromise = assignmentServices.assign(assignment, _task._links.assignments.href);
                                assignmentPromise.then(function (_data) {
                                    thisScope.loadAssignments();
                                });
                                $uibModalInstance.close();
                            };
                        }
                        $scope.cancel = function () {
                            $uibModalInstance.dismiss('cancel');
                        };
                    },
                    size: 'sm'
                });
            };

            $scope.updateTask = function (_summary, _task) {
                var task = _task;
                if (task.summary == "") {
                    return;
                }
                task.summary = _summary;
                var taskPromise = tasksServices.update(task);
                taskPromise.then(function () {
                });
            };
            $scope.openDeleteModal = function (_message, _link) {
                var currentScope = $scope;
                $uibModal.open({
                    animation: false,
                    templateUrl: 'foundation/modal/partials/confirm-dialog.html',
                    controller: function ($scope, $uibModalInstance) {
                        $scope.title = '警告';
                        $scope.message = "确定要删除" + _message + "吗?";
                        $scope.ok = function () {
                            var _taskDeletePromise = tasksServices.deleteByLink(_link);
                            _taskDeletePromise.then(function () {
                                currentScope.$parent.loadTasks();
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

            $scope.isAssigned = function () {
                var userId = localStorageService.get("userId");
                $scope.isIamAssigned = false;
                angular.forEach($scope.assignments, function (_assignment) {
                    if (userId === _assignment.assignee) {
                        $scope.isIamAssigned = true;
                        return;
                    }
                });
                $scope.assignTip = $scope.isIamAssigned === true ? "我不做了" : "认领";
            };
        }]
    };
});


