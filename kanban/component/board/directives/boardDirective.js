/**
 * Created by xubt on 10/15/16.
 */

kanbanApp.directive('board', function () {
    return {
        restrict: 'E',
        templateUrl: 'component/board/partials/board.html',
        replace: true,
        transclude: true,
        scope: {
            board: '='
        },
        controller: ['$scope', 'boardsService', 'localStorageService', '$location', function ($scope, boardsService, localStorageService, $location) {
            $scope.toProcedures = function (_boardId, _boardLink) {
                localStorageService.set("boardLink", _boardLink);
                $location.path('/boards/' + _boardId);
            };
        }]
    };
});
