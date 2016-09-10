/**
 * Created by xubt on 4/20/16.
 */

kanbanApp.controller('teamsController', ['$scope', '$location', '$q', 'teamsService', 'localStorageService',
    function ($scope, $location, $q, teamsService, localStorageService) {
        var teamsLink = localStorageService.get("user.links").teams.href;
        var teamPromise = teamsService.load(teamsLink);
        teamsService.teamsLink = teamsLink;
        teamPromise.then(function (data) {
            $scope.teams = data;
        });

        $scope.toTeam = function (_teamId, _teamLink) {
            localStorageService.set("teamLink", _teamLink);
            $location.path('/teams/' + _teamId);
        };
        $scope.displayTeamCreationForm = true;
        $scope.displayForm = false;
        $scope.createTeam = function () {
            if ($scope.name === undefined || $scope.name === "") {
                $scope.isShowNameError = true;
                return;
            }
            var name = $scope.name;
            var team = {name: name};
            var entriesPromise = teamsService.create(team, teamsLink);
            entriesPromise.then(function (data) {
                if ($scope.teams === null) {
                    $scope.teams = [];
                }
                $scope.teams.push(data);
                $scope.cancelCreateTeam();
                $scope.name = "";
            });
        };
        $scope.keyPress = function ($event) {
            if ($event.keyCode == 13) {
                $scope.createTeam();
            }
            if ($event.keyCode == 27) {
                $scope.cancelCreateTeam();
            }
        };
        $scope.showTeamCreationForm = function () {
            $scope.displayTeamCreationForm = false;
            $scope.displayForm = true;
        };
        $scope.cancelCreateTeam = function () {
            $scope.displayTeamCreationForm = true;
            $scope.displayForm = false;
        };
    }]);
