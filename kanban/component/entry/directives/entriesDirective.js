/**
 * Created by xubt on 4/29/16.
 */
kanbanApp.directive('entries', function () {
    return {
        restrict: 'E',
        templateUrl: 'component/entry/partials/entries.html',
        replace: true,
        scope: false,
        controller: ['$scope', 'boardsService', 'entriesServices', 'localStorageService', function ($scope, boardsService, entriesServices, localStorageService) {
            $scope.loadEntries = function () {
                var boardLink = localStorageService.get("boardLink");
                var boardPromise = boardsService.loadBoardByLink(boardLink);
                boardPromise.then(function (_board) {
                    $scope.board = _board;
                    entriesServices.entriesLink = _board._links.entries.href;
                    var entriesPromise = entriesServices.load(_board._links.entries.href);
                    entriesPromise.then(function (data) {
                            $scope.entries = data;
                        $scope.entrySortableOptions = {
                            connectWith: ".entry-item",
                            opacity: 0.5,
                            placeholder: "entry-drag-placeholder",
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
                                ui.item.sortable.model.orderNumber = ui.item.sortable.dropindex;
                                var _entryPromise = entriesServices.update(ui.item.sortable.model);
                                _entryPromise.then(function (data) {
                                    $scope.loadEntries();
                                });
                            }
                        };
                        }
                    );
                });
            };
            $scope.loadEntries();
        }]
    };
});
