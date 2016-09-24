/**
 * Created by xubt on 9/23/16.
 */

kanbanApp.directive('notification', function () {
    return {
        restrict: 'E',
        templateUrl: 'component/notification/partials/notification.html',
        replace: true,
        controller: ['$scope', '$location', 'notificationsService', 'invitationService', 'teamsService', 'timerMessageService', 'localStorageService', '$uibModal', function ($scope, $location, notificationsService, invitationService, teamsService, timerMessageService, localStorageService, $uibModal) {
            $scope.readNotification = function () {
                var notificationPromise = notificationsService.loadNotificationByLink($scope.notification._links.self.href);
                notificationPromise.then(function (_notification) {
                    $scope.notification = _notification;
                    if ($scope.notification.type === "team-members-invitation") {
                        var invitationPromise = invitationService.loadInvitationByLink($scope.notification.link);
                        invitationPromise.then(function (_invitation) {
                            if (!_invitation.isAccepted) {
                                var teamPromise = teamsService.loadTeamByLink(_invitation._links.team.href);
                                teamPromise.then(function (_team) {
                                    $uibModal.open({
                                        animation: false,
                                        templateUrl: 'component/team/partials/accept-invitation.html',
                                        controller: function ($scope, $uibModalInstance) {
                                            $scope.teamName = _team.name;
                                            $scope.ok = function () {
                                                var invitationPromise = invitationService.acceptInvitation($scope.notification.link);
                                                invitationPromise.then(function (_data) {
                                                    timerMessageService.message("已经加入团队");
                                                });
                                                $uibModalInstance.close();
                                            };
                                            $scope.cancel = function () {
                                                $uibModalInstance.dismiss('cancel');
                                            };
                                        },
                                        size: 'sm'
                                    });
                                });
                            }
                        });
                    }
                });
            }
        }]
    };
});
