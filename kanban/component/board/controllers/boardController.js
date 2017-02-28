/**
 * Created by xubt on 4/20/16.
 */

kanbanApp.controller('boardController', ['$scope', '$location', '$q', 'projectsService', 'boardsService', 'localStorageService', '$uibModal', 'timerMessageService', 'usersService',
    function ($scope, $location, $q, projectsService, boardsService, localStorageService, $uibModal, timerMessageService, usersService) {

        var currentUser = usersService.getCurrentUser();

        var uploadWorkTileTasksLink;

        $scope.loadBoards = function () {
            var loadingInstance = timerMessageService.loading();
            projectsService.load(currentUser._links.projects.href)
                .then(function (_projects) {
                    $scope.boards = [];
                    for (var index in _projects.projects) {
                        boardsService.load(_projects.projects[index]._links.boards.href)
                            .then(function (_boards) {
                                $scope.boards = $scope.boards.concat(_boards.boards);
                            });
                    }
                }).finally(function () {
                timerMessageService.close(loadingInstance);
            });
        };
        $scope.loadBoards();
        $scope.displayBoardCreationForm = true;
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
                    $scope.openPersonalBoardCreationDialog = function () {
                        $uibModalInstance.dismiss('cancel');
                        $uibModal.open({
                            animation: false,
                            templateUrl: 'component/board/partials/personal-board-creation.html',
                            controller: function ($scope, $uibModalInstance, timerMessageService) {
                                $scope.creationButtonText = "创建";
                                $scope.isDisableCreationButton = false;
                                $scope.boardName = "";
                                $scope.createBoard = function () {
                                    $scope.creationButtonText = "创建中..";
                                    $scope.isDisableCreationButton = true;

                                    var board = {name: $scope.boardName};
                                    boardsService.create(board).then(function (data) {
                                        timerMessageService.message("创建成功，正在更新数据。");
                                        $uibModalInstance.dismiss('cancel');
                                        boardsScope.loadBoards();
                                    }).finally(function () {
                                        $scope.creationButtonText = "创建";
                                        $scope.isDisableCreationButton = false;
                                    });
                                };
                                $scope.cancel = function () {
                                    $uibModalInstance.dismiss('cancel');
                                };
                            },
                            size: 'sm',
                            backdrop: "static"
                        });
                    };
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
                                    $scope.importButtonText = "导入中..";
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
                                };
                            },
                            size: 'board',
                            backdrop: "static"
                        });
                    };
                },
                size: 'board',
                backdrop: "static"
            });
        };
    }]);
