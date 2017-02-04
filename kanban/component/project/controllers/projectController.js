/**
 * Created by xubt on 4/20/16.
 */

kanbanApp.controller('projectController', ['$scope', '$location', '$q', 'projectsService', 'localStorageService', 'timerMessageService', '$uibModal', '$injector',
    function ($scope, $location, $q, projectsService, localStorageService, timerMessageService, $uibModal, $injector) {
        var projectLink = localStorageService.get("projectLink");
        var projectPromise = projectsService.loadProjectByLink(projectLink);

        projectPromise.then(function (_project) {
            $scope.project = _project;

            var membersLink = _project._links.members.href;

            var membersPromise = projectsService.loadMembers(membersLink);

                membersPromise.then(function (_data) {
                    $scope.currentUserMemberLink = _data._links.member.href;
                    $scope.members = _data.members;
                    $scope.invitationLink = _data._links.invitation.href;

                });

            $scope.toMyProjects = function () {
                $location.path(localStorageService.get('identity.userName') + "/projects");
                };

            $scope.saveProject = function () {
                var projectPromise = projectsService.update($scope.project);
                projectPromise.then(function (_project) {
                    $scope.project = _project;
                    timerMessageService.message("项目信息已经更新。");
                    });
                };
                $scope.openInvitationForm = function () {
                    var projectScope = $scope;
                    $uibModal.open({
                        animation: true,
                        templateUrl: 'component/project/partials/member-invitation.html',
                        controller: function ($scope, $uibModalInstance) {
                            $scope.isDisableInvitationButton = false;
                            $scope.invitationButtonText = "邀请";
                            $scope.invite = function () {
                                $scope.invitationButtonText = "邀请中..";
                                $scope.isDisableInvitationButton = true;
                                var invitation = {invitee: $scope.invitee};
                                var invitationPromise = projectsService.invite(invitation, projectScope.invitationLink);
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
            $scope.openLeaveProjectDialog = function () {
                var projectScope = $scope;
                    $uibModal.open({
                        animation: true,
                        templateUrl: 'component/project/partials/leave-project.html',
                        controller: function ($scope, $uibModalInstance, projectMembersService) {
                            $scope.project = projectScope.project;
                            $scope.isDisableLeaveButton = false;
                            $scope.leaveButtonText = "离开";
                            $scope.leaveProject = function () {
                                $scope.leaveButtonText = "稍等..";
                                $scope.isDisableLeaveButton = true;
                                projectMembersService.leave(projectScope.currentUserMemberLink)
                                    .then(function () {
                                        $uibModalInstance.dismiss('cancel');
                                        timerMessageService.message("你已经离开该项目。");
                                        $location.path(localStorageService.get('identity.userName') + "/projects");
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
