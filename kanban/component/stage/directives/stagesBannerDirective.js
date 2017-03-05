/**
 * Created by xubt on 10/15/16.
 */
kanbanApp.directive('stagesBanner', function () {
    return {
        restrict: 'E',
        templateUrl: 'component/stage/partials/stage-banner.html',
        replace: true,
        scope: false,
        controller: ['$scope', 'boardsService', 'stagesServices', 'localStorageService', '$uibModal', 'usersService', function ($scope, boardsService, stagesServices, localStorageService, $uibModal, usersService) {
            var stagesScope = $scope;
            var projectsUrl = usersService.getCurrentUser()._links.projects.href;
            $scope.openProjectsDialog = function () {
                $uibModal.open({
                    animation: true,
                    templateUrl: 'component/stage/partials/projects.html',
                    controller: ['$scope', 'projectsService', 'timerMessageService', '$uibModalInstance',
                        function ($scope, projectsService, timerMessageService, $uibModalInstance) {
                            var projectsPromise = projectsService.load(projectsUrl);
                            $scope.selectedProject = {};
                            projectsPromise.then(function (_projects) {
                                $scope.projects = _projects.projects;
                                var projectPromise = projectsService.loadProjectByLink(stagesScope.board._links.project.href);
                                projectPromise.then(function (_project) {
                                    $scope.projects.selected = _project;
                                });
                            });
                            $scope.archiveButtonText = "变更所有权";
                            $scope.isDisabledArchiveButton = false;
                            $scope.archiveBoard = function () {
                                $scope.archiveButtonText = "所有权变更中..";
                                $scope.isDisabledArchiveButton = true;
                                stagesScope.board.projectId = $scope.projects.selected.id;
                                var boardPromise = boardsService.update(stagesScope.board);

                                boardPromise.then(function (_board) {
                                    timerMessageService.message("看板已为" + $scope.projects.selected.name + "项目所有");
                                    stagesScope.board = _board;
                                    $uibModalInstance.dismiss('cancel');
                                }).finally(function () {
                                    $scope.archiveButtonText = "变更所有权";
                                    $scope.isDisabledArchiveButton = false;
                                });
                            };
                        }
                    ],
                    size: 'sm'
                });
            };
            $scope.openBoardConfiguration = function () {
                $uibModal.open({
                    animation: true,
                    templateUrl: 'component/board/partials/board-configuration.html',
                    controller: ['$scope', 'projectsService', 'timerMessageService', '$uibModalInstance',
                        function ($scope, projectsService, timerMessageService, $uibModalInstance) {
                            $scope.board = stagesScope.board;
                            $scope.boardSaveButton = "保存";
                            $scope.saveBoard = function () {
                                $scope.boardSaveButton = "保存中..";
                                $scope.isDisableBoardSaveButton = true;
                                var boardPromise = boardsService.update(stagesScope.board);
                                boardPromise.then(function (_board) {
                                    timerMessageService.message("看板配置已经更新");
                                    stagesScope.board = _board;
                                    $scope.board = _board;
                                }).finally(function () {
                                    $scope.boardSaveButton = "保存";
                                    $scope.isDisableBoardSaveButton = false;
                                });
                            };
                        }
                    ],
                    size: 'sm', backdrop: "static"
                });
            };
            $scope.openBoardDelete = function () {
                $uibModal.open({
                    animation: true,
                    templateUrl: 'component/stage/partials/board-delete-confirm.html',
                    controller: ['$scope', 'projectsService', 'timerMessageService', '$location', '$uibModalInstance',
                        function ($scope, projectsService, timerMessageService, $location, $uibModalInstance) {
                            $scope.board = stagesScope.board;
                            $scope.deleteButtonText = "删除";
                            $scope.deleteBoard = function () {
                                $scope.deleteButtonText = "删除中..";
                                $scope.isDisableBoardSaveButton = true;
                                var boardPromise = boardsService.deleteBoard(stagesScope.board);
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
                        }
                    ],
                    size: 'sm', backdrop: "static"
                });
            };

            $scope.openBoardTags = function () {
                $uibModal.open({
                    animation: true,
                    templateUrl: 'component/stage/partials/tags-configuration.html',
                    controller: ['$scope', 'projectsService', 'timerMessageService', '$location', '$uibModalInstance',
                        function ($scope) {
                            $scope.board = stagesScope.board;
                        }
                    ],
                    size: 'mid',
                    backdrop: "static"
                });
            };
            $scope.openCardCreationDialog = function () {
                $uibModal.open({
                    animation: true,
                    templateUrl: 'component/card/partials/card-creation.html',
                    controller: ['$scope', 'projectsService', 'timerMessageService', '$uibModalInstance', 'jsonService', 'stagesServices', 'cardsServices', '$filter',
                        function ($scope, projectsService, timerMessageService, $uibModalInstance, jsonService, stagesServices, cardsServices, $filter) {
                            $scope.board = stagesScope.board;
                            $scope.cardSaveButton = "创建";
                            $scope.sizeList = [
                                {id: 1, name: "S"},
                                {id: 2, name: "M"},
                                {id: 3, name: "L"},
                                {id: 5, name: "XL"},
                                {id: 8, name: "XXL"},
                                {id: 9999, name: "不可估算"}
                            ];
                            $scope.stages = stagesServices.filterInSprintStages(stagesScope.board.stagesNode.stages);
                            $scope.card = {summary: ""};
                            $scope.saveCard = function () {
                                $scope.cardSaveButton = "稍等..";
                                $scope.isDisableCardSaveButton = true;
                                if ($scope.card.deadline !== undefined && $scope.card.deadline.format !== undefined) {
                                    $scope.card.deadline = $scope.card.deadline.format("YYYY-MM-DD");
                                }
                                if ($scope.sizeList.selected !== undefined) {
                                    $scope.card.size = $scope.sizeList.selected.id;
                                }
                                $scope.card.stageId = $scope.stages.selected.id;
                                cardsServices.create($scope.card, $scope.board._links.cards.href).then(function (_card) {
                                    _card.isNew = true;
                                    var indexOf = jsonService.indexOf(stagesScope.board.stagesNode.stages, "id", $scope.stages.selected.id);
                                    stagesScope.board.stagesNode.stages[indexOf].cardsNode.cards.push(_card);
                                    var newCardElement = angular.element(document.getElementById("card-" + _card.id));
                                    newCardElement.removeClass('new-card');
                                    timerMessageService.message("卡片已经创建。");
                                    $uibModalInstance.dismiss('cancel');
                                }).finally(function () {
                                    $scope.cardSaveButton = "创建";
                                    $scope.isDisableCardSaveButton = false;
                                });
                            };
                        }
                    ],
                    size: 'lg',
                    backdrop: "static"
                });
            };
        }]
    };
});