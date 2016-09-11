/**
 * Created by xubt on 4/20/16.
 */

kanbanApp.controller('teamController', ['$scope', '$location', '$q', 'teamsService', 'localStorageService',
    function ($scope, $location, $q, teamsService, localStorageService) {
        var teamLink = localStorageService.get("teamLink");
        var teamPromise = teamsService.loadTeamByLink(teamLink);
        teamPromise.then(function (_team) {
            $scope.team = _team;

            var membersLink = _team._links.members.href;

            var membersPromise = teamsService.loadMembers(membersLink);

            membersPromise.then(function (_data) {
                $scope.members = _data;
            });
        });
    }]);
