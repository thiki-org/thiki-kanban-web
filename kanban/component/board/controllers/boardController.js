/**
 * Created by xubt on 4/20/16.
 */

kanbanApp.controller('boardController', ['$scope', '$location', '$q', 'boardsService', 'localStorageService', '$uibModal',
    function ($scope, $location, $q, boardsService, localStorageService, $uibModal) {
        var boardsLink = localStorageService.get("user.links").boards.href;
        var boardsPromise = boardsService.load(boardsLink);
        boardsService.boardsLink = boardsLink;
        var uploadWorkTileTasksLink;

        $scope.loadBoards = function () {
            var boardsPromise = boardsService.load(boardsLink);
            boardsPromise.then(function (_data) {
                $scope.boards = _data.boards;
                uploadWorkTileTasksLink = _data._links.worktileTasks.href;
            });
        };
        $scope.loadBoards();
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

        var boardsScope = $scope;
        $scope.openBoardCreationDialog = function () {
            $uibModal.open({
                animation: false,
                templateUrl: 'component/board/partials/board-creation-type.html',
                controller: function ($scope, $uibModalInstance) {
                    $scope.openWorktileDialog = function () {
                        $uibModalInstance.dismiss('cancel');
                        $uibModal.open({
                            animation: false,
                            templateUrl: 'component/board/partials/worktile-import.html',
                            controller: function ($scope, $uibModalInstance, timerMessageService) {
                                $scope.importButtonText = "导入";
                                $scope.isDisableImportButton = true;

                                $scope.updateTasksFile = function (file, errFiles) {
                                    $scope.file = file;
                                    $scope.isDisableImportButton = false;
                                };

                                $scope.uploadTasksFile = function () {
                                    $scope.importButtonText = "导入中";
                                    $scope.isDisableImportButton = true;
                                    if ($scope.file) {
                                        boardsService.uploadWorkTileTasks($scope.file, uploadWorkTileTasksLink)
                                            .then(function (_data) {
                                                timerMessageService.message("数据已经成功导入,更新马上就绪。");
                                                $uibModalInstance.dismiss('cancel');
                                                boardsScope.loadBoards();
                                            }).finally(function () {
                                            $scope.importButtonText = "导入";
                                            $scope.isDisableImportButton = false;
                                        });

                                    }
                                }
                            },
                            size: 'board'
                        });
                    };
                },
                size: 'board'
            });
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
