/**
 * Created by xubt on 4/20/16.
 */

kanbanApp.controller('boardController', ['$scope', '$location', '$q', 'boardsService', 'localStorageService',
    function ($scope, $location, $q, boardsService, localStorageService) {
        var boardsLink = localStorageService.get("user.links").boards.href;
        var boardPromise = boardsService.load(boardsLink);
        boardsService.boardsLink = boardsLink;
        boardPromise.then(function (data) {
            $scope.boards = data;
        });
        $scope.displayBoardCreationForm = true;
        $scope.displayForm = false;
        $scope.createBoard = function () {
            if ($scope.name === undefined || $scope.name === "") {
                $scope.isShowNameError = true;
                return;
            }
            var name = $scope.name;
            var board = {name: name};
            var entriesPromise = boardsService.create(board);
            entriesPromise.then(function (data) {
                if ($scope.boards === null) {
                    $scope.boards = [];
                }
                $scope.boards.push(data);
                $scope.cancelCreateBoard();
                $scope.name = "";
            });
        };
        $scope.keyPress = function ($event) {
            if ($event.keyCode == 13) {
                $scope.createBoard();
            }
            if ($event.keyCode == 27) {
                $scope.cancelCreateBoard();
            }
        };
        $scope.showBoardCreationForm = function () {
            $scope.displayBoardCreationForm = false;
            $scope.displayForm = true;
        };
        $scope.cancelCreateBoard = function () {
            $scope.displayBoardCreationForm = true;
            $scope.displayForm = false;
        };
    }]);
