/**
 * Created by xubt on 4/20/16.
 */

kanbanApp.controller('teamController', ['$scope', '$location', '$q', 'teamsService', 'localStorageService', '$uibModal',
    function ($scope, $location, $q, teamsService, localStorageService, $uibModal) {
        var teamLink = localStorageService.get("teamLink");
        var teamPromise = teamsService.loadTeamByLink(teamLink);
        $scope.isDisableInvitationButton = false;
        $scope.invitationButtonText = "邀请";
        teamPromise.then(function (_team) {
            $scope.team = _team;

            var membersLink = _team._links.members.href;

            var membersPromise = teamsService.loadMembers(membersLink);

            membersPromise.then(function (_data) {
                $scope.members = _data.members;
                $scope.invitationLink = _data._links.invitation.href;

            });
            $scope.openInvitationForm = function () {
                $uibModal.open({
                    animation: true,
                    templateUrl: 'component/team/partials/member-invitation.html',
                    controller: "teamController",
                    size: 'sm'
                });
            };

            $scope.invite = function () {
                $scope.invitationButtonText = "邀请中..";
                $scope.isDisableInvitationButton = true;
                var invitation = {invitee: $scope.invitee};
                var invitationPromise = teamsService.invite(invitation, $scope.invitationLink);
                invitationPromise.then(function (_data) {
                }).finally(function () {
                    $scope.invitationButtonText = "邀请";
                    $scope.isDisableInvitationButton = false;
                });
            }
        });
    }]);
