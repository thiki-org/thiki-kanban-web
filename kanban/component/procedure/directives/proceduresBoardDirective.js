/**
 * Created by xubt on 10/15/16.
 */
kanbanApp.directive('proceduresBoard', function () {
    return {
        restrict: 'E',
        templateUrl: 'component/procedure/partials/board.html',
        replace: true,
        scope: false,
        controller: ['$scope', 'boardsService', 'proceduresServices', 'localStorageService', '$uibModal', 'usersService', function ($scope, boardsService, proceduresServices, localStorageService, $uibModal, usersService) {
            var proceduresScope = $scope;
            var projectsUrl = usersService.getCurrentUser()._links.projects.href;
            $scope.openProjectsDialog = function () {
                $uibModal.open({
                    animation: true,
                    templateUrl: 'component/procedure/partials/projects.html',
                    controller: ['$scope', 'projectsService', 'timerMessageService', '$uibModalInstance',
                        function ($scope, projectsService, timerMessageService, $uibModalInstance) {
                            var projectsPromise = projectsService.load(projectsUrl);
                            $scope.selectedProject = {};
                            projectsPromise.then(function (_projects) {
                                $scope.projects = _projects.projects;
                                var projectPromise = projectsService.loadProjectByLink(proceduresScope.board._links.project.href);
                                projectPromise.then(function (_project) {
                                    $scope.projects.selected = _project;
                                });
                            });
                            $scope.archiveButtonText = "变更所有权";
                            $scope.isDisabledArchiveButton = false;
                            $scope.archiveBoard = function () {
                                $scope.archiveButtonText = "所有权变更中..";
                                $scope.isDisabledArchiveButton = true;
                                proceduresScope.board.projectId = $scope.projects.selected.id;
                                var boardPromise = boardsService.update(proceduresScope.board);

                                boardPromise.then(function (_board) {
                                    timerMessageService.message("看板已为" + $scope.projects.selected.name + "项目所有");
                                    proceduresScope.board = _board;
                                    $uibModalInstance.dismiss('cancel');
                                }).finally(function () {
                                    $scope.archiveButtonText = "变更所有权";
                                    $scope.isDisabledArchiveButton = false;
                                });
                            };
                        }],
                    size: 'sm'
                });
            };

            $scope.openBoardConfiguration = function () {
                $uibModal.open({
                    animation: true,
                    templateUrl: 'component/board/partials/board-configuration.html',
                    controller: ['$scope', 'projectsService', 'timerMessageService', '$uibModalInstance',
                        function ($scope, projectsService, timerMessageService, $uibModalInstance) {
                            $scope.board = proceduresScope.board;
                            $scope.boardSaveButton = "保存";
                            $scope.saveBoard = function () {
                                $scope.boardSaveButton = "保存中..";
                                $scope.isDisableBoardSaveButton = true;
                                var boardPromise = boardsService.update(proceduresScope.board);
                                boardPromise.then(function (_board) {
                                    timerMessageService.message("看板配置已经更新");
                                    proceduresScope.board = _board;
                                    $scope.board = _board;
                                }).finally(function () {
                                    $scope.boardSaveButton = "保存";
                                    $scope.isDisableBoardSaveButton = false;
                                });
                            };
                        }],
                    size: 'sm'
                });
            };
            $scope.openBoardDelete = function () {
                $uibModal.open({
                    animation: true,
                    templateUrl: 'component/procedure/partials/board-delete-confirm.html',
                    controller: ['$scope', 'projectsService', 'timerMessageService', '$location', '$uibModalInstance',
                        function ($scope, projectsService, timerMessageService, $location, $uibModalInstance) {
                            $scope.board = proceduresScope.board;
                            $scope.deleteButtonText = "删除";
                            $scope.deleteBoard = function () {
                                $scope.deleteButtonText = "删除中..";
                                $scope.isDisableBoardSaveButton = true;
                                var boardPromise = boardsService.deleteBoard(proceduresScope.board);
                                boardPromise.then(function (_board) {
                                    timerMessageService.message("看板【" + $scope.board.name + "】已经删除,马上为你跳转..");
                                    var dashboardLink = localStorageService.get("identity.userName") + '/dashboard';
                                    $uibModalInstance.dismiss('cancel');
                                    $location.path(dashboardLink);
                                }).finally(function () {
                                    $scope.deleteButtonText = "删除";
                                    $scope.deleteButtonText = false;
                                });
                            };
                        }],
                    size: 'sm'
                });
            };

            $scope.openBoardTags = function () {
                $uibModal.open({
                    animation: true,
                    templateUrl: 'component/procedure/partials/tags-configuration.html',
                    controller: ['$scope', 'projectsService', 'timerMessageService', '$location', '$uibModalInstance',
                        function ($scope) {
                            $scope.board = proceduresScope.board;
                        }],
                    size: 'mid',
                    backdrop: "static"
                });
            };
        }]
    };
});
