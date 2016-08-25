/**
 * Created by xubt on 4/29/16.
 */
kanbanApp.directive('procedureCreation', function () {
    return {
        restrict: 'E',
        templateUrl: 'component/procedure/partials/procedures-creation.html',
        replace: true,
        scope: true,
        controller: ['$scope', 'proceduresServices', function ($scope, proceduresServices) {
            $scope.createProcedure = function () {
                var title = $scope.title;
                var procedure = {title: title, boardId: $scope.board.id};
                var proceduresPromise = proceduresServices.create(procedure);
                proceduresPromise.then(function (data) {
                    if ($scope.procedures === null) {
                        $scope.procedures = [];
                    }
                    $scope.procedures.push(data);
                    $scope.title = "";
                    $scope.cancelCreateProcedure();
                });
            };

            $scope.displayCreationButton = true;
            $scope.displayForm = false;
            $scope.cancelCreateProcedure = function () {
                $scope.displayCreationButton = true;
                $scope.displayForm = false;
            };
            $scope.showCreateProcedureForm = function () {
                $scope.displayCreationButton = false;
                $scope.displayForm = true;
            };
            $scope.keyPress = function ($event) {
                if ($event.keyCode == 13) {
                    $scope.createProcedure();
                }
                if ($event.keyCode == 27) {
                    $scope.cancelCreateProcedure();
                }
            };
            $scope.blur = function () {
                if ($scope.title === "" || $scope.title === undefined) {
                    $scope.cancelCreateProcedure();
                }
            };
        }]
    };
});
