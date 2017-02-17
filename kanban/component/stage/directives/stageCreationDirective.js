/**
 * Created by xubt on 4/29/16.
 */
kanbanApp.directive('stageCreation', function () {
    return {
        restrict: 'E',
        templateUrl: 'component/stage/partials/stages-creation.html',
        replace: true,
        scope: {
            stages: '='
        },
        controller: ['$scope', 'stagesServices', function ($scope, stagesServices) {
            $scope.createStage = function () {
                var title = $scope.title;
                var stage = {title: title};
                var stagesPromise = stagesServices.create(stage, $scope.$parent.board._links.stages.href);
                stagesPromise.then(function (data) {
                    if ($scope.stages === null) {
                        $scope.stages = [];
                    }
                    $scope.stages.push(data);
                    $scope.title = "";
                    $scope.cancelCreateStage();
                });
            };

            $scope.displayCreationButton = true;
            $scope.displayForm = false;
            $scope.cancelCreateStage = function () {
                $scope.displayCreationButton = true;
                $scope.title = "";
                $scope.displayForm = false;
            };
            $scope.showCreateStageForm = function () {
                $scope.displayCreationButton = false;
                $scope.displayForm = true;
            };
            $scope.keyPress = function ($event) {
                if ($event.keyCode == 13) {
                    $scope.createStage();
                }
                if ($event.keyCode == 27) {
                    $scope.cancelCreateStage();
                }
            };
            $scope.blur = function () {
                if ($scope.title === "" || $scope.title === undefined) {
                    $scope.cancelCreateStage();
                }
            };
        }]
    };
});
