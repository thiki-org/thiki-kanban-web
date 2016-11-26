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
                    $scope.currentUserMemberLink = _data._links.member.href;
                    $scope.members = _data.members;
                    $scope.invitationLink = _data._links.invitation.href;

                });

                $scope.toMyTeams = function () {
                    $location.path(localStorageService.get('identity.userName') + "/teams");
                };

                $scope.saveTeam = function () {
                    var teamPromise = teamsService.update($scope.team);
                    teamPromise.then(function (_team) {
                        $scope.team = _team;
                        timerMessageService.message("团队信息已经更新。");
                    });
                };
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
                $scope.openLeaveTeamDialog = function () {
                    var teamScope = $scope;
                    $uibModal.open({
                        animation: true,
                        templateUrl: 'component/team/partials/leave-team.html',
                        controller: function ($scope, $uibModalInstance, teamMembersService) {
                            $scope.team = teamScope.team;
                            $scope.isDisableLeaveButton = false;
                            $scope.leaveButtonText = "离开";
                            $scope.leaveTeam = function () {
                                $scope.leaveButtonText = "稍等..";
                                $scope.isDisableLeaveButton = true;
                                teamMembersService.leave(teamScope.currentUserMemberLink)
                                    .then(function () {
                                        $uibModalInstance.dismiss('cancel');
                                        timerMessageService.message("你已经离开该团队。");
                                        $location.path(localStorageService.get('identity.userName') + "/teams");
                                    }).finally(function () {
                                    $scope.leaveButtonText = "离开";
                                    $scope.isDisableLeaveButton = false;
                                });
                            };
                        },
                        size: 'sm'
                    });
                };
            }
        );
    }]);
