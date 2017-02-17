/**
 * Created by xubt on 4/29/16.
 */
kanbanApp.directive('procedures', function () {
    return {
        restrict: 'E',
        templateUrl: 'component/procedure/partials/procedures.html',
        replace: true,
        controller: ['$scope', 'boardsService', 'proceduresServices', 'localStorageService', '$uibModal', 'usersService', 'timerMessageService', function ($scope, boardsService, proceduresServices, localStorageService, $uibModal, usersService, timerMessageService) {
            $scope.loadSprint = function () {
                boardsService.loadActiveSprint($scope.board._links.activeSprint.href).then(function (_sprint) {
                    $scope.sprint = _sprint;
                }, function (_rejection) {
                    if (_rejection.status === 404) {
                        $scope.noActiveSprintWasFound = true;
                    }
                });
            };
            $scope.loadProcedures = function (_activeViewType, _typeName) {
                var currentBoard = localStorageService.get("currentBoard");
                var snapshotLink = _activeViewType === undefined ? currentBoard._links.sprintViewSnapshot.href : currentBoard._links[_activeViewType].href;
                $scope.typeName = _typeName === undefined ? "迭代视图" : _typeName;
                $scope.activeViewType = _activeViewType;

                var boardPromise = boardsService.loadBoardByLink(snapshotLink);
                $scope.loadingInstance = timerMessageService.loading($scope.typeName + "加载中..");
                boardPromise.then(function (_board) {
                    $scope.board = _board;
                    $scope.loadSprint();
                    $scope.procedures = _board.procedures.procedures;
                    timerMessageService.message("最后渲染中...");
                    $scope.procedureSortableOptions = {
                        connectWith: ".procedure-item",
                        opacity: 0.5,
                        placeholder: "procedure-drag-placeholder",
                        stop: function (e, ui) {
                            if (ui.item.sortable.droptarget === undefined) {
                                return;
                            }
                            var procedures = ui.item.sortable.sourceModel;
                            for (var index in procedures) {
                                procedures[index].sortNumber = index;
                            }
                            var sortNumbersLink = JSON.parse(ui.item.sortable.source.attr("boardClone")).procedures._links.sortNumbers.href;
                            proceduresServices.resort(procedures, sortNumbersLink);
                        }
                    };
                }).finally(function () {
                    timerMessageService.close($scope.loadingInstance);
                });
            };
            $scope.loadProcedures();
            $scope.closeLoading = function () {
                timerMessageService.close($scope.loadingInstance);
            };
            var currentScope = $scope;
            $scope.openSprintDialog = function () {
                $uibModal.open({
                    animation: true,
                    templateUrl: 'component/board/partials/sprint-configuration.html',
                    controller: ['$scope', 'boardsService', 'timerMessageService',
                        function ($scope, boardsService, timerMessageService) {
                            $scope.sprint = {startTime: moment(), endTime: moment(), sprintName: ""};
                            if (currentScope.sprint !== undefined) {
                                $scope.sprint = currentScope.sprint;
                            }
                            $scope.sprintSaveButtonText = "保存";
                            $scope.isDisableSprintSaveButton = false;
                            $scope.saveSprint = function () {
                                $scope.isDisableBoardSaveButton = true;
                                boardsService.saveSprint($scope.sprint, currentScope.board._links.sprints.href).then(function (_sprint) {
                                    currentScope.sprint = _sprint;
                                    timerMessageService.message("迭代信息设置成功。");
                                }).finally(function () {
                                    $scope.isDisableBoardSaveButton = false;
                                });
                            };
                            $scope.$watch('sprint', function (newValue, oldValue) {
                                if (oldValue === newValue) {
                                    return;
                                }
                                if ($scope.sprint.startTime.isAfter($scope.sprint.endTime)) {
                                    $scope.showStartTimeIsAfterEndTime = true;
                                    $scope.isDisableSprintSaveButton = true;
                                }
                                else {
                                    $scope.showStartTimeIsAfterEndTime = false;
                                    $scope.isDisableSprintSaveButton = false;
                                }
                            });
                        }],
                    size: 'sprint',
                    backdrop: "static"
                });
            };
            $scope.openSprintCompetitionDialog = function () {
                $uibModal.open({
                    templateUrl: 'component/board/partials/sprint-competition-confirm-dialog.html',
                    controller: ['$scope', 'boardsService', 'timerMessageService', '$uibModalInstance',
                        function ($scope, boardsService, timerMessageService, $uibModalInstance) {
                            $scope.title = '迭代完成前确认';
                            $scope.message = "确认本次迭代已经完成？一经操作后不可撤销，请谨慎操作。";
                            $scope.sprintCompetitionButtonText = "完成迭代";
                            $scope.isDisableSprintCompetitionButton = false;
                            $scope.ok = function () {
                                $scope.loadingInstance = timerMessageService.loading();
                                $scope.sprintCompetitionButtonText = "归档中..";
                                $scope.isDisableSprintCompetitionButton = true;
                                currentScope.sprint.status = 2;
                                boardsService.saveSprint(currentScope.sprint, currentScope.board._links.sprints.href).then(function () {
                                    currentScope.sprint = undefined;
                                    currentScope.loadProcedures();
                                    timerMessageService.message("本次迭代已经完成，卡片已经归档。");
                                }).finally(function () {
                                    timerMessageService.close($scope.loadingInstance);
                                    $scope.sprintCompetitionButtonText = "完成迭代";
                                    $scope.isDisableSprintCompetitionButton = false;
                                });
                                $uibModalInstance.close();
                            };
                            $scope.cancel = function () {
                                $uibModalInstance.dismiss('cancel');
                            };
                        }],
                    size: 'mid',
                    backdrop: "static"
                });
            };
            $scope.openPagesDialog = function () {
                $uibModal.open({
                    animation: true,
                    templateUrl: 'component/page/partials/pages-dialog.html',
                    controller: ['$scope', 'boardsService', 'timerMessageService',
                        function ($scope) {
                            $scope.board = currentScope.board;
                        }],
                    size: 'pages',
                    backdrop: "static"
                });
            };
            $scope.isShowFilterInput = false;
            $scope.filterButtonText = "过滤";
            $scope.disPlayFilterInput = function () {
                if ($scope.isShowFilterInput === true) {
                    $scope.isShowFilterInput = false;
                    $scope.filterButtonText = "过滤";
                    return;
                }
                $scope.isShowFilterInput = true;
                $scope.filterButtonText = "收起";
            };
        }]
    };
});