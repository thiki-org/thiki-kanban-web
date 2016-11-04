/**
 * Created by xubt on 11/4/16.
 */

kanbanApp.directive('avatar', function () {
    return {
        restrict: 'E',
        templateUrl: 'component/users/partials/avatar.html',
        replace: true,
        transclude: true,
        scope: {
            avatarLink: '=',
            profileLink: '=',
            customStyle: '@'
        },
        controller: ['$scope', 'usersService', function ($scope, usersService) {
            var avatarPromise = usersService.loadAvatar($scope.avatarLink);
            avatarPromise.then(function (_avatar) {
                $scope.avatar = "data:image/png;base64," + _avatar.avatar.replaceAll("\"", "");
            });
            var profilePromise = usersService.loadProfile($scope.profileLink);
            profilePromise.then(function (_profile) {
                $scope.nickName = _profile.nickName === undefined ? $scope.userName : _profile.nickName;
            });
        }]
    };
});
