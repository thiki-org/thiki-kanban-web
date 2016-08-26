/**
 * Created by xubt on 4/29/16.
 */

kanbanApp.directive('procedure', function ($uibModal) {
    return {
        restrict: 'E',
        templateUrl: 'component/procedure/partials/procedure.html',
        replace: true,
        transclude: true,
        scope: {
            procedure: '='
        },
        controller: ['$scope', 'boardsService', 'proceduresServices', function ($scope, boardsService, proceduresServices) {
            $scope.displayProcedureMenu = false;
            $scope.onProcedureMenuMouseOver = function ($event) {
                $scope.displayProcedureMenu = true;
            };
            $scope.onProcedureMenuMouseLeave = function ($event) {
                $scope.displayProcedureMenu = false;
            };

            var currentScope = $scope;
            $scope.openModal = function (_message, _link) {
                $uibModal.open({
                    animation: false,
                    templateUrl: 'foundation/modal/partials/confirm-dialog.html',
                    controller: function ($scope, $uibModalInstance) {
                        $scope.title = '警告';
                        $scope.message = "确定要删除" + _message + "吗?";
                        $scope.ok = function () {
                            var _procedureDeletePromise = proceduresServices.deleteByLink(_link);
                            _procedureDeletePromise.then(function () {
                                currentScope.$parent.loadProcedures();
                            });
                            $uibModalInstance.close();
                        };
                        $scope.cancel = function () {
                            $uibModalInstance.dismiss('cancel');
                        };
                    },
                    size: 'sm'
                });
            };
            $scope.updateProcedure = function (_title, _procedure) {
                var procedure = _procedure;
                if (_title === "") {
                    return "标题不能为空";
                }
                procedure.title = _title;
                var procedurePromise = proceduresServices.update(procedure);
                procedurePromise.then(function () {
                });
            };

            $scope.open = function () {
                $scope.displayProcedureMenu = false;
            };
        }]
    };
});
