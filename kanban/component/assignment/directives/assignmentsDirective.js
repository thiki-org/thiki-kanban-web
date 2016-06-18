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
                var assignmentsPromise = assignmentServices.loadAssignments($scope.task._links.assignments.href);
                assignmentsPromise.then(function (_data) {
                    $scope.assignments = _data;
                });
            };

            $scope.loadAssignments();
        }]
    };
});
