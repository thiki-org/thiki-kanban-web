/**
 * Created by xubt on 4/20/16.
 */

var boardController = angular.module('boardController', []);

var boardsLink = "http://localhost:8080/boards";

boardController.controller('boardController', ['$scope', '$location', '$q', 'boardsService',
    function ($scope, $location, $q, boardsService) {
        var boardPromise = boardsService.load(boardsLink);
        boardsService.boardsLink = boardsLink;
        boardPromise.then(function (data) {
            $scope.boards = data;
        })

        $scope.toEntries = function (_boardId, _boardLink) {
            $location.path('/boards/' + _boardId + '/entries').search({boardLink: _boardLink});
        }
        $scope.displayBoardCreationForm = true;
        $scope.displayForm = false;
        $scope.createBoard = function () {
            var name = $scope.board.name;
            var board = {name: name};
            var entriesPromise = boardsService.create(board);
            entriesPromise.then(function (data) {
                if ($scope.boards == null) {
                    $scope.boards = [];
                }
                $scope.boards.push(data);
                $scope.board.name = "";
            });
        };
        $scope.keyPress = function ($event) {
            if ($event.keyCode == 13) {
                $scope.createBoard();
            }
            if ($event.keyCode == 27) {
                $scope.cancelCreateTask();
            }
        };
        $scope.showBoardCreationForm = function () {
            $scope.displayBoardCreationForm = false;
            $scope.displayForm = true;
        };
        $scope.cancelCreateTask = function () {
            $scope.displayBoardCreationForm = true;
            $scope.displayForm = false;
        };
    }]);
