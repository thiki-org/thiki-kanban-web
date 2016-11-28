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
            var proceduresScope = $scope;
            $scope.openProcedureConfiguration = function () {
                $uibModal.open({
                    animation: true,
                    templateUrl: 'component/procedure/partials/procedure-configuration.html',
                    controller: ['$scope', 'teamsService', 'timerMessageService', '$uibModalInstance',
                        function ($scope, teamsService, timerMessageService, $uibModalInstance) {
                            $scope.procedure = proceduresScope.procedure;
                            $scope.procedureSaveButton = "保存";
                            $scope.saveProcedure = function () {
                                $scope.procedureSaveButton = "保存中..";
                                $scope.isDisableProcedureSaveButton = true;
                                var procedurePromise = proceduresServices.update($scope.procedure);
                                procedurePromise.then(function (_procedure) {
                                    timerMessageService.message("配置已经更新");
                                    proceduresScope.procedure = _procedure;
                                    $scope.procedure = _procedure;
                                    $uibModalInstance.dismiss('cancel');
                                }).finally(function () {
                                    $scope.procedureSaveButton = "保存";
                                    $scope.isDisableProcedureSaveButton = false;
                                });
                            };
                        }],
                    size: 'sm'
                });
            };

            $scope.toFullScreen = function () {
                $uibModal.open({
                    animation: true,
                    templateUrl: 'component/procedure/partials/procedure-full-screen.html',
                    controller: ['$scope', 'teamsService', 'timerMessageService', '$uibModalInstance',
                        function ($scope, teamsService, timerMessageService, $uibModalInstance) {
                            $scope.procedure = proceduresScope.procedure;
                            $scope.finishCardsOperation = function () {
                                $uibModalInstance.dismiss('cancel');
                            }
                        }],
                    size: 'fullscreen'
                });
            };
        }]
    };
});
