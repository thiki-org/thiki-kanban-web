/**
 * Created by xubt on 9/23/16.
 */

kanbanApp.directive('notification', function () {
    return {
        restrict: 'E',
        templateUrl: 'component/notification/partials/notification.html',
        replace: true,
        controller: ['$scope', '$location', 'notificationsService', 'invitationService', 'projectsService', 'timerMessageService', 'localStorageService', '$uibModal', function ($scope, $location, notificationsService, invitationService, projectsService, timerMessageService, localStorageService, $uibModal) {
            $scope.readNotification = function () {
                var notificationPromise = notificationsService.loadNotificationByLink($scope.notification._links.self.href);
                notificationPromise.then(function (_notification) {
                    $scope.notification = _notification;
                    var notificationScope = $scope;
                    if ($scope.notification.type === "project-members-invitation") {
                        var invitationPromise = invitationService.loadInvitationByLink($scope.notification.link);
                        invitationPromise.then(function (_invitation) {
                            if (_invitation.isAccepted) {
                                timerMessageService.message("你此前已经接受该项目的邀请。");
                                return;
                            }
                            var projectPromise = projectsService.loadProjectByLink(_invitation._links.project.href);
                            projectPromise.then(function (_project) {
                                $uibModal.open({
                                    animation: false,
                                    templateUrl: 'component/project/partials/accept-invitation.html',
                                    controller: function ($scope, $uibModalInstance) {
                                        $scope.projectName = _project.name;
                                        $scope.acceptInvitation = function () {
                                            var invitationPromise = invitationService.acceptInvitation(notificationScope.notification.link);
                                            invitationPromise.then(function (_data) {
                                                timerMessageService.message("你已成功加入项目。");
                                            });
                                            $uibModalInstance.close();
                                        };
                                        $scope.cancel = function () {
                                            $uibModalInstance.dismiss('cancel');
                                        };
                                    },
                                    size: 'sm', backdrop: "static"
                                });
                            });
                        });
                    }
                    if ($scope.notification.type === "assignment" || ($scope.notification.type === "cancel-assignment")) {
                        var currentScope = $scope;
                        $uibModal.open({
                            animation: false,
                            templateUrl: 'foundation/modal/partials/confirm-dialog.html',
                            controller: function ($scope, $uibModalInstance) {
                                $scope.title = "提示";
                                $scope.message = currentScope.content;
                                $scope.ok = function () {
                                    $uibModalInstance.dismiss('cancel');
                                };
                            },
                            size: 'notification', backdrop: "static"
                        });
                    }
                });
            };
        }]
    };
});
