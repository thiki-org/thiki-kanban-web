/**
 * Created by xubt on 4/20/16.
 */

var boardController = angular.module('boardController', []);

var boardsLink = "http://localhost:8080/boards";

boardController.controller('boardController', ['$scope', '$location', '$q', 'boardsService',
    function ($scope, $location, $q, boardsService) {
        var boardPromise = boardsService.load(boardsLink);
        boardPromise.then(function (data) {
            $scope.boards = data;
        })

        $scope.toEntries = function (_boardId, _boardLink) {
            $location.path('/boards/' + _boardId + '/entries').search({boardLink: _boardLink});
        }
    }]);
