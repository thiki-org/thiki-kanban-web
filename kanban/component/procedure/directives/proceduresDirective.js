/**
 * Created by xubt on 4/29/16.
 */
kanbanApp.directive('procedures', function () {
    return {
        restrict: 'E',
        templateUrl: 'component/procedure/partials/procedures.html',
        replace: true,
        scope: false,
        controller: ['$scope', 'boardsService', 'proceduresServices', 'localStorageService', '$uibModal', 'usersService', 'timerMessageService', function ($scope, boardsService, proceduresServices, localStorageService, $uibModal, usersService, timerMessageService) {
            $scope.loadSprint = function () {
                boardsService.loadActiveSprint($scope.board._links.activeSprint.href).then(function (_sprint) {
                    console.log(_sprint);
                    $scope.sprint = _sprint;
                }, function (_rejection) {
                    if (_rejection.status === 404) {
                        $scope.noActiveSprintWasFound = true;
                    }
                });
            };
            $scope.loadProcedures = function () {
                var boardLink = localStorageService.get("boardLink");

                var boardPromise = boardsService.loadBoardByLink(boardLink);
                $scope.loadingInstance = timerMessageService.loading();
                boardPromise.then(function (_board) {
                    $scope.board = _board;
                    $scope.loadSprint();
                    $scope.procedures = _board.procedures.procedures;
                    timerMessageService.message("最后渲染中...");
                    $scope.procedureSortableOptions = {
                        connectWith: ".procedure-item",
                        opacity: 0.5,
                        placeholder: "procedure-drag-placeholder",
                        start: function (e, ui) {
                            console.log("staring sort.");
                        },
                        update: function (e, ui) {
                            console.log("updating sort.");
                        },
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
                            $scope.sprint = {startTime: moment(), endTime: moment()};
                            if (currentScope.sprint !== undefined) {
                                $scope.sprint = currentScope.sprint;
                            }
                            $scope.sprintSaveButtonText = "保存";
                            $scope.isDisableSprintSaveButton = false;
                            $scope.saveSprint = function () {
                                boardsService.saveSprint($scope.sprint, currentScope.board._links.sprints.href).then(function (_sprint) {
                                    currentScope.sprint = _sprint;
                                    timerMessageService.message("迭代信息设置成功。");
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
                    size: 'mid',
                    backdrop: "static"
                });
            };
        }]
    };
});