/**
 * Created by xubt on 5/26/16.
 */

kanbanApp.directive('boardBanner', function () {
    return {
        restrict: 'E',
        templateUrl: 'component/board/partials/board-banner.html',
        replace: true,
        controller: ['$scope', '$location', 'boardsService', 'localStorageService', function ($scope, $location, boardsService, localStorageService) {
            var boardLink = localStorageService.get("boardLink");

            var boardPromise = boardsService.loadBoardByLink(boardLink);
            boardPromise.then(function (_board) {
                $scope.board = _board;
            });
            $scope.toBoards = function () {
                $location.path('/boards');
            };
        }]
    };
});
