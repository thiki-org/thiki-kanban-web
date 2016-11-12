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
                    proceduresServices.proceduresLink = _board._links.procedures.href;
                    var proceduresPromise = proceduresServices.load(_board._links.procedures.href);
                    proceduresPromise.then(function (_data) {
                        timerMessageService.close($scope.loadingInstance);
                        $scope.procedures = _data.procedures;
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
                                var sortNumbersLink = _data._links.sortNumbers.href;
                                proceduresServices.resort(procedures, sortNumbersLink);
                            }
                        };
                    });
                });
            };
            $scope.loadProcedures();
            $scope.closeLoading = function () {
                timerMessageService.close($scope.loadingInstance);
            };
        }]
    };
});
