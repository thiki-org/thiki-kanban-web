/**
 * Created by xubt on 6/18/16.
 */
kanbanApp.directive('assignments', function () {
    return {
        restrict: 'E',
        templateUrl: 'component/assignment/partials/assignments.html',
        replace: true,
        controller: ['$scope', 'assignmentServices', function ($scope, assignmentServices) {
            $scope.loadAssignments = function () {
                var thisScope = $scope;
                var assignmentsPromise = assignmentServices.loadAssignments($scope.card._links.assignments.href);
                assignmentsPromise.then(function (_data) {
                    $scope.assignments = _data.assignments;
                    thisScope.isAssigned();
                });
            };

            $scope.loadAssignments();
        }]
    };
});
