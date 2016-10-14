/**
 * Created by xubt on 4/29/16.
 */
kanbanApp.directive('procedures', function () {
    return {
        restrict: 'E',
        templateUrl: 'component/procedure/partials/procedures.html',
        replace: true,
        scope: false,
        controller: ['$scope', 'boardsService', 'proceduresServices', 'localStorageService', '$uibModal', 'usersService', function ($scope, boardsService, proceduresServices, localStorageService, $uibModal, usersService) {
            $scope.loadProcedures = function () {
                var boardLink = localStorageService.get("boardLink");
                var boardPromise = boardsService.loadBoardByLink(boardLink);
                boardPromise.then(function (_board) {
                    $scope.board = _board;
                    proceduresServices.proceduresLink = _board._links.procedures.href;
                    var proceduresPromise = proceduresServices.load(_board._links.procedures.href);
                    proceduresPromise.then(function (data) {
                        $scope.procedures = data;
                        $scope.procedureSortableOptions = {
                            connectWith: ".procedure-item",
                            opacity: 0.5,
                            placeholder: "procedure-drag-placeholder",
                            start: function (e, ui) {
                                console.log("staring sort.");
                            },
                            update: function (e, ui) {
                                console.log("updating sort.");

                            },
                            stop: function (e, ui) {
                                if (ui.item.sortable.droptarget === undefined) {
                                    return;
                                }
                                ui.item.sortable.model.orderNumber = ui.item.sortable.dropindex;
                                var _procedurePromise = proceduresServices.update(ui.item.sortable.model);
                                _procedurePromise.then(function (data) {
                                    $scope.loadProcedures();
                                });
                                }
                        };
                        }
                    );
                });
            };
            $scope.loadProcedures();
            $scope.mouseover = function () {
                $scope.isDisplaySetting = true;
            };

            $scope.onMouseLeave = function () {
                $scope.isDisplaySetting = false;
            };

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
                            $scope.archiveBoard = function () {
                                proceduresScope.board.teamId = $scope.teams.selected.id;
                                var boardPromise = boardsService.update(proceduresScope.board);
                                boardPromise.then(function (_board) {
                                    timerMessageService.message("看板已为" + $scope.teams.selected.name + "团队所有");
                                    proceduresScope.board = _board;
                                    $uibModalInstance.dismiss('cancel');
                                });
                            }
                        }],
                    size: 'sm'
                });
            };
        }]
    };
});
