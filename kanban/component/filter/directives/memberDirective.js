/**
 * Created by xubt on 4/29/16.
 */

kanbanApp.directive('filterMember', function () {
    return {
        restrict: 'E',
        templateUrl: 'component/filter/partials/member.html',
        replace: true,
        transclude: true,
        scope: {
            member: '='
        },
        controller: ['$scope', 'usersService', 'advancedFilterFactory', function ($scope, usersService, advancedFilterFactory) {
            $scope.selectMember = function (_member) {
                advancedFilterFactory.addMember(_member);
                _member.selected = !_member.selected;
            };
        }]
    };
});