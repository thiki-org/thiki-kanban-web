/**
 * Created by xubt on 6/18/16.
 */
kanbanApp.directive('assignments', function () {
    return {
        restrict: 'E',
        templateUrl: 'component/assignment/partials/assignments.html',
        replace: true,
        controller: ['$scope', 'assignmentServices', 'timerMessageService', function ($scope, assignmentServices, timerMessageService) {
            $scope.loadAssignments = function () {
                var thisScope = $scope;
                $scope.assignments = $scope.card.assignments === undefined ? [] : $scope.card.assignments.assignments;
                thisScope.isAssigned();
            };
            $scope.loadAssignments();
        }]
    };
});
