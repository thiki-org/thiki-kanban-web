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
        controller: ['$scope', 'boardsService', 'projectsService', 'localStorageService', '$location', function ($scope, boardsService, projectsService, localStorageService, $location) {
            if ($scope.board._links.project !== undefined) {
                var projectPromise = projectsService.loadProjectByLink($scope.board._links.project.href);
                projectPromise.then(function (_project) {
                    $scope.project = _project;
                });
            }
            $scope.toProcedures = function () {
                localStorageService.set('currentBoard', $scope.board);
                $location.path('/boards/' + $scope.board.id);
            };
        }]
    };
});
