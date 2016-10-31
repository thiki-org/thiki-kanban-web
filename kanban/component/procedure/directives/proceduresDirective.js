/**
 * Created by xubt on 4/29/16.
 */
kanbanApp.directive('procedures', function () {
    return {
        restrict: 'E',
        templateUrl: 'component/procedure/partials/procedures.html',
        replace: true,
        scope: false,
        controller: ['$scope', 'boardsService', 'proceduresServices', 'localStorageService', '$uibModal', 'usersService', function ($scope, boardsService, proceduresServices, localStorageService, $uibModal, usersService) {
            $scope.loadProcedures = function () {
                var boardLink = localStorageService.get("boardLink");
                var boardPromise = boardsService.loadBoardByLink(boardLink);
                boardPromise.then(function (_board) {
                    $scope.board = _board;
                    proceduresServices.proceduresLink = _board._links.procedures.href;
                    var proceduresPromise = proceduresServices.load(_board._links.procedures.href);
                    proceduresPromise.then(function (_data) {
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
        }]
    };
});
