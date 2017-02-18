/**
 * Created by xubt on 4/29/16.
 */

kanbanApp.directive('filterMember', function() {
    return {
        restrict: 'E',
        templateUrl: 'component/filter/partials/member.html',
        replace: true,
        transclude: true,
        scope: {
            member: '='
        },
        controller: ['$scope', 'usersService', 'advancedFilterFactory', function($scope, usersService, advancedFilterFactory) {
            var avatarPromise = usersService.loadAvatar($scope.member._links.avatar.href);
            avatarPromise.then(function(_avatar) {
                $scope.avatar = "data:image/png;base64," + _avatar.avatar.replaceAll("\"", "");
            });
            var profilePromise = usersService.loadProfile($scope.member._links.profile.href);
            profilePromise.then(function(_profile) {
                $scope.nickName = _profile.nickName === undefined ? $scope.member.userName : _profile.nickName;
            });
            $scope.selectMember = function(_member) {
                advancedFilterFactory.addMember(_member);
                _member.selected = !_member.selected;
            };
        }]
    };
});