/**
 * Created by xubt on 11/4/16.
 */

kanbanApp.directive('nickName', function () {
    return {
        restrict: 'E',
        templateUrl: 'component/users/partials/nick-name.html',
        replace: true,
        transclude: true,
        scope: {
            profileLink: '='
        },
        controller: ['$scope', 'usersService', function ($scope, usersService) {
            usersService.loadProfile($scope.profileLink).then(function (_profile) {
                $scope.nickName = _profile.nickName;
            });
        }]
    };
});
