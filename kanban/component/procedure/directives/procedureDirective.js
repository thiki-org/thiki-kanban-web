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
        controller: ['$scope', 'boardsService', 'proceduresServices', function ($scope, boardsService, proceduresServices, $document) {
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
                    controller: ['$scope', 'teamsService', 'timerMessageService', '$uibModalInstance', 'jsonService',
                        function ($scope, teamsService, timerMessageService, $uibModalInstance, jsonService) {
                            $scope.procedure = proceduresScope.procedure;
                            $scope.procedureSaveButton = "保存";
                            $scope.types = [{id: 0, name: "尚未开始迭代"}, {id: 1, name: "迭代中"}];
                            $scope.statusList = [{id: 0, name: "默认"}, {id: 9, name: "完成"}];
                            $scope.types.selected = $scope.types[$scope.procedure.type];
                            $scope.statusList.selected = jsonService.findById($scope.statusList, $scope.procedure.status);
                            $scope.saveProcedure = function () {
                                $scope.procedure.type = $scope.types.selected.id;
                                $scope.procedure.status = $scope.statusList.selected.id;

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
                    size: 'mid',
                    backdrop: "static"
                });
            };
            $scope.scrollToCardCreation = function () {
                $scope.procedure.isShowCardCreation = true;
                var cardsElement = angular.element(document.getElementById("cards-" + $scope.procedure.id));
                var cardCreationElement = angular.element(document.getElementById("card-creation-" + $scope.procedure.id));
                cardsElement.scrollToElement(cardCreationElement, 20, 500).then(function () {
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
                            };
                        }],
                    size: 'fullscreen'
                });
            };

            $scope.openArchiveDialog = function () {
                $uibModal.open({
                    animation: true,
                    templateUrl: 'component/procedure/partials/procedure-archive.html',
                    controller: ['$scope', 'teamsService', 'timerMessageService', '$uibModalInstance',
                        function ($scope, teamsService, timerMessageService, $uibModalInstance) {
                            $scope.procedure = {};
                            $scope.archiveButtonText = "归档";
                            $scope.isDisableArchiveButton = false;
                            $scope.archive = function () {
                                $scope.archiveButtonText = "归档中..";
                                $scope.isDisableArchiveButton = true;
                                proceduresServices.create($scope.procedure, proceduresScope.procedure._links.archive.href)
                                    .then(function () {
                                        timerMessageService.message("归档成功，正在为您刷新数据..");
                                        currentScope.$parent.loadProcedures();
                                    }).finally(function () {
                                    $scope.isDisableArchiveButton = false;
                                    $scope.archiveButtonText = "归档";
                                });
                                $uibModalInstance.dismiss('cancel');
                            };
                        }],
                    size: 'mid'
                });
            };
        }
        ]
    };
});
