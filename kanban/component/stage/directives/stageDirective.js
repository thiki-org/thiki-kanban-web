/**
 * Created by xubt on 4/29/16.
 */

kanbanApp.directive('stage', function($uibModal) {
    return {
        restrict: 'E',
        templateUrl: 'component/stage/partials/stage.html',
        replace: true,
        transclude: true,
        scope: {
            stage: '=',
            board: '='
        },
        controller: ['$scope', 'boardsService', 'stagesServices', function($scope, boardsService, stagesServices, $document) {
            $scope.displayStageMenu = false;
            $scope.onStageMenuMouseOver = function($event) {
                $scope.displayStageMenu = true;
            };
            $scope.onStageMenuMouseLeave = function($event) {
                $scope.displayStageMenu = false;
            };

            var currentScope = $scope;
            $scope.cardsCount = $scope.stage.cardsNode === undefined ? 0 : $scope.stage.cardsNode.cards.length;
            $scope.openModal = function(_message, _link) {
                $uibModal.open({
                    animation: false,
                    templateUrl: 'foundation/modal/partials/confirm-dialog.html',
                    controller: function($scope, $uibModalInstance) {
                        $scope.title = '警告';
                        $scope.message = "确定要删除" + _message + "吗?";
                        $scope.ok = function() {
                            var _stageDeletePromise = stagesServices.deleteByLink(_link);
                            _stageDeletePromise.then(function() {
                                currentScope.$parent.loadStages();
                            });
                            $uibModalInstance.close();
                        };
                        $scope.cancel = function() {
                            $uibModalInstance.dismiss('cancel');
                        };
                    },
                    size: 'sm'
                });
            };
            $scope.updateStage = function(_title, _stage) {
                var stage = _stage;
                if (_title === "") {
                    return "标题不能为空";
                }
                stage.title = _title;
                var stagePromise = stagesServices.update(stage);
                stagePromise.then(function() {});
            };

            $scope.open = function() {
                $scope.displayStageMenu = false;
            };
            var stagesScope = $scope;
            $scope.openStageConfiguration = function() {
                $uibModal.open({
                    animation: true,
                    templateUrl: 'component/stage/partials/stage-configuration.html',
                    controller: ['$scope', 'projectsService', 'timerMessageService', '$uibModalInstance', 'jsonService',
                        function($scope, projectsService, timerMessageService, $uibModalInstance, jsonService) {
                            $scope.stage = stagesScope.stage;
                            $scope.stageSaveButton = "保存";
                            $scope.types = [{ id: 0, name: "迭代计划" }, { id: 1, name: "迭代中" }];
                            $scope.statusList = [{ id: 0, name: "默认" }, { id: 1, name: "处理中" }, { id: 9, name: "完成" }];
                            $scope.types.selected = $scope.types[$scope.stage.type];
                            $scope.statusList.selected = jsonService.findById($scope.statusList, $scope.stage.status);
                            $scope.saveStage = function() {
                                $scope.stage.type = $scope.types.selected.id;
                                $scope.stage.status = $scope.statusList.selected.id;

                                $scope.stageSaveButton = "保存中..";
                                $scope.isDisableStageSaveButton = true;
                                var stagePromise = stagesServices.update($scope.stage);
                                stagePromise.then(function(_stage) {
                                    timerMessageService.message("配置已经更新");
                                    stagesScope.stage = _stage;
                                    $scope.stage = _stage;
                                    $uibModalInstance.dismiss('cancel');
                                }).finally(function() {
                                    $scope.stageSaveButton = "保存";
                                    $scope.isDisableStageSaveButton = false;
                                });
                            };
                        }
                    ],
                    size: 'mid',
                    backdrop: "static"
                });
            };
            $scope.scrollToCardCreation = function() {
                $scope.stage.isShowCardCreation = true;
                var cardsElement = angular.element(document.getElementById("cards-" + $scope.stage.id));
                var cardCreationElement = angular.element(document.getElementById("card-creation-" + $scope.stage.id));
                cardsElement.scrollToElement(cardCreationElement, 20, 500).then(function() {});
            };
            $scope.toFullScreen = function() {
                $uibModal.open({
                    animation: true,
                    templateUrl: 'component/stage/partials/stage-full-screen.html',
                    controller: ['$scope', 'projectsService', 'timerMessageService', '$uibModalInstance',
                        function($scope, projectsService, timerMessageService, $uibModalInstance) {
                            $scope.stage = stagesScope.stage;
                            $scope.finishCardsOperation = function() {
                                $uibModalInstance.dismiss('cancel');
                            };
                        }
                    ],
                    size: 'fullscreen'
                });
            };

            $scope.openArchiveDialog = function() {
                $uibModal.open({
                    animation: true,
                    templateUrl: 'component/stage/partials/stage-archive.html',
                    controller: ['$scope', 'projectsService', 'timerMessageService', '$uibModalInstance',
                        function($scope, projectsService, timerMessageService, $uibModalInstance) {
                            $scope.stage = {};
                            $scope.archiveButtonText = "归档";
                            $scope.isDisableArchiveButton = false;
                            $scope.archive = function() {
                                $scope.archiveButtonText = "归档中..";
                                $scope.isDisableArchiveButton = true;
                                stagesServices.create($scope.stage, stagesScope.stage._links.archives.href)
                                    .then(function() {
                                        timerMessageService.message("归档成功，正在为您刷新数据..");
                                        currentScope.$parent.loadStages();
                                        $uibModalInstance.dismiss('cancel');
                                    }).finally(function() {
                                        $scope.isDisableArchiveButton = false;
                                        $scope.archiveButtonText = "归档";
                                    });
                            };
                        }
                    ],
                    size: 'mid'
                });
            };
        }]
    };
});