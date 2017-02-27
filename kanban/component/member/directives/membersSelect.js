/**
 * Created by xubt on 26/02/2017.
 */
/**
 * Created by xubt on 02/26/17.
 */
kanbanApp.directive('membersSelect', function () {
    return {
        restrict: 'E',
        templateUrl: 'component/member/partials/members-select.html',
        replace: true,
        transclude: true,
        scope: {
            board: '='
        },
        controller: ['$scope', 'localStorageService', 'membersService', 'jsonService', function ($scope, localStorageService, membersService, jsonService) {
            $scope.loadMembers = function () {
                membersService.loadByBoard($scope.board._links.members.href).then(function (_membersNode) {
                    $scope.members = _membersNode.members;
                });
            };
            $scope.loadMembers();
            $scope.selectMember = function (_selectedMember) {
                $scope.$parent.selectMember(_selectedMember);
            };
        }]
    };
});