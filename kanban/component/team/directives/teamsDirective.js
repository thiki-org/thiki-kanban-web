/**
 * Created by xubt on 5/26/16.
 */

kanbanApp.directive('teamBanner', function () {
    return {
        restrict: 'E',
        templateUrl: 'component/team/partials/team-banner.html',
        replace: true,
        controller: ['$scope', '$location', 'teamsService', 'localStorageService', '$uibModal', function ($scope, $location, teamsService, localStorageService, $uibModal) {
            var teamLink = localStorageService.get("teamLink");
            var teamsLink = localStorageService.get("identity.userName") + '/teams';

            var teamPromise = teamsService.loadTeamByLink(teamLink);
            teamPromise.then(function (_team) {
                $scope.team = _team;
            });
            $scope.toTeams = function () {
                $location.path(teamsLink);
            };
            $scope.updateTeam = function (_name, _team) {
                var team = _team;
                if (_name === "") {
                    return "请输入看板名称";
                }
                team.name = _name;
                teamsService.update(team);
            };
            $scope.mouseover = function () {
                $scope.isDisplaySetting = true;
            };

            $scope.onMouseLeave = function () {
                $scope.isDisplaySetting = false;
            };

            $scope.deleteTeam = function (_team) {
                var thisScope = $scope;
                $uibModal.open({
                    animation: false,
                    templateUrl: 'component/team/partials/delete-team-confirm.html',
                    controller: function ($scope, $uibModalInstance) {
                        $scope.title = '请输入看板名称以确认删除';
                        $scope.team = _team;
                        $scope.ok = function () {
                            var teamPromise = teamsService.deleteTeam(_team);
                            teamPromise.then(function (_data) {
                                thisScope.toTeams();
                            });
                            $uibModalInstance.close();
                        };
                        $scope.cancel = function () {
                            $uibModalInstance.dismiss('cancel');
                        };
                    },
                    size: 'sm'
                });
            }
        }]
    };
});
