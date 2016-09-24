/**
 * Created by xubt on 4/20/16.
 */

kanbanApp.controller('teamController', ['$scope', '$location', '$q', 'teamsService', 'localStorageService', 'timerMessageService', '$uibModal', '$injector',
    function ($scope, $location, $q, teamsService, localStorageService, timerMessageService, $uibModal, $injector) {
        var teamLink = localStorageService.get("teamLink");
        var teamPromise = teamsService.loadTeamByLink(teamLink);

        teamPromise.then(function (_team) {
            $scope.team = _team;

            var membersLink = _team._links.members.href;

            var membersPromise = teamsService.loadMembers(membersLink);

            membersPromise.then(function (_data) {
                $scope.members = _data.members;
                $scope.invitationLink = _data._links.invitation.href;

            });
            $scope.openInvitationForm = function () {
                var teamScope = $scope;
                $uibModal.open({
                    animation: true,
                    templateUrl: 'component/team/partials/member-invitation.html',
                    controller: function ($scope, $uibModalInstance) {
                        $scope.isDisableInvitationButton = false;
                        $scope.invitationButtonText = "邀请";
                        $scope.invite = function () {
                            $scope.invitationButtonText = "邀请中..";
                            $scope.isDisableInvitationButton = true;
                            var invitation = {invitee: $scope.invitee};
                            var invitationPromise = teamsService.invite(invitation, teamScope.invitationLink);
                            invitationPromise.then(function () {
                                $uibModalInstance.dismiss('cancel');
                                timerMessageService.message("邀请成功,邀请函已经发出。");
                            }).finally(function () {
                                $scope.invitationButtonText = "邀请";
                                $scope.isDisableInvitationButton = false;
                            });
                        };
                    },
                    size: 'sm'
                });
            };
        });
    }]);
