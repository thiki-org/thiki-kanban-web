/**
 * Created by xubt on 4/20/16.
 */

var boardController = angular.module('boardController', []);

var boardsLink = "http://localhost:8080/boards";

boardController.controller('BoardsCtrl', ['$scope', '$location', '$q', 'BoardService',
    function ($scope, $location, $q, BoardService) {
        var boardPromise = BoardService.load(boardsLink);
        boardPromise.then(function (data) {
            $scope.boards = data;
        })

        $scope.toTasks = function (_boardId, _entriesLink) {
            $location.path('/boards/' + _boardId + '/entries').search({entriesLink: _entriesLink});
        }
    }]);
