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
            var teamsUrl = usersService.getCurrentUser()._links.teams.href;
            $scope.openTeamsDialog = function () {
                $uibModal.open({
                    animation: true,
                    templateUrl: 'component/procedure/partials/teams.html',
                    controller: ['$scope', 'teamsService', 'timerMessageService', '$uibModalInstance',
                        function ($scope, teamsService, timerMessageService, $uibModalInstance) {
                            var teamsPromise = teamsService.load(teamsUrl);
                            $scope.selectedTeam = {};
                            teamsPromise.then(function (_teams) {
                                $scope.teams = _teams;
                                var teamPromise = teamsService.loadTeamByLink(proceduresScope.board._links.team.href);
                                teamPromise.then(function (_team) {
                                    $scope.teams.selected = _team;
                                });
                            });
                            $scope.archiveButtonText = "变更所有权";
                            $scope.isDisabledArchiveButton = false;
                            $scope.archiveBoard = function () {
                                $scope.archiveButtonText = "所有权变更中..";
                                $scope.isDisabledArchiveButton = true;
                                proceduresScope.board.teamId = $scope.teams.selected.id;
                                var boardPromise = boardsService.update(proceduresScope.board);

                                boardPromise.then(function (_board) {
                                    timerMessageService.message("看板已为" + $scope.teams.selected.name + "团队所有");
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
                    controller: ['$scope', 'teamsService', 'timerMessageService', '$uibModalInstance',
                        function ($scope, teamsService, timerMessageService, $uibModalInstance) {
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
                    controller: ['$scope', 'teamsService', 'timerMessageService', '$location', '$uibModalInstance',
                        function ($scope, teamsService, timerMessageService, $location, $uibModalInstance) {
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
                    controller: ['$scope', 'teamsService', 'timerMessageService', '$location', '$uibModalInstance',
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
