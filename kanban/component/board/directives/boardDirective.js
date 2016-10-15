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
        controller: ['$scope', 'boardsService', 'teamsService', 'localStorageService', '$location', function ($scope, boardsService, teamsService, localStorageService, $location) {
            console.log($scope.board);
            if ($scope.board._links.team != undefined) {
                var teamPromise = teamsService.loadTeamByLink($scope.board._links.team.href);
                teamPromise.then(function (_team) {
                    $scope.team = _team;
                });
            }
            $scope.toProcedures = function (_boardId, _boardLink) {
                localStorageService.set("boardLink", _boardLink);
                $location.path('/boards/' + _boardId);
            };
        }]
    };
});
