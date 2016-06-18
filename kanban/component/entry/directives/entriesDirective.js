/**
 * Created by xubt on 4/29/16.
 */
kanbanApp.directive('entries', function () {
    return {
        restrict: 'E',
        templateUrl: 'component/entry/partials/entries.html',
        replace: true,
        scope: true,
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
                        }
                    );
                });
            };
            $scope.loadEntries();
        }]
    };
});
