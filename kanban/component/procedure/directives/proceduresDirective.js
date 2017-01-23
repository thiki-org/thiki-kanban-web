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
            $scope.loadProcedures = function () {
                var boardLink = localStorageService.get("boardLink");
                var boardPromise = boardsService.loadBoardByLink(boardLink);
                $scope.loadingInstance = timerMessageService.loading();
                boardPromise.then(function (_board) {
                    $scope.board = _board;
                    $scope.procedures = _board.procedures.procedures;
                    timerMessageService.message("稍等，还差最后一点准备...");
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
        }]
    };
});
