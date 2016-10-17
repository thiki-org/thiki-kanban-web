/**
 * Created by xubt on 6/17/16.
 */
kanbanApp.directive('card', function ($uibModal) {
    return {
        restrict: 'E',
        templateUrl: 'component/card/partials/card.html',
        replace: true,
        transclude: true,
        scope: {
            card: '='
        },
        controller: ['$scope', 'localStorageService', 'assignmentServices', 'cardsServices', function ($scope, localStorageService, assignmentServices, cardsServices) {
            $scope.assign = function (_card) {
                var thisScope = $scope;
                $uibModal.open({
                    animation: false,
                    templateUrl: 'component/card/partials/assignment-confirm.html',
                    controller: function ($scope, $uibModalInstance) {
                        $scope.title = '确认信息';
                        if (thisScope.isIamAssigned) {
                            $scope.message = "你确定不再做该卡片吗?";
                            $scope.ok = function () {
                                var userName = localStorageService.get("userName");
                                var myAssignmentLink;
                                angular.forEach(thisScope.assignments, function (_assignment) {
                                    if (userName === _assignment.assignee) {
                                        myAssignmentLink = _assignment._links.self.href;

                                    }
                                });
                                var assignmentPromise = assignmentServices.giveUp(myAssignmentLink);
                                assignmentPromise.then(function (_data) {
                                    thisScope.loadAssignments();
                                });
                                $uibModalInstance.close();
                            };
                        }
                        else {
                            $scope.message = "你确定要认领该卡片吗?";
                            $scope.ok = function () {
                                var assignment = {
                                    cardId: _card.id,
                                    assignee: localStorageService.get("userName"),
                                    assigner: localStorageService.get("userName")
                                };

                                var assignmentPromise = assignmentServices.assign(assignment, _card._links.assignments.href);
                                assignmentPromise.then(function (_data) {
                                    thisScope.loadAssignments();
                                });
                                $uibModalInstance.close();
                            };
                        }
                        $scope.cancel = function () {
                            $uibModalInstance.dismiss('cancel');
                        };
                    },
                    size: 'sm'
                });
            };

            var cardScope = $scope;
            $scope.openCardConfiguration = function () {
                $uibModal.open({
                    animation: true,
                    templateUrl: 'component/card/partials/card-configuration.html',
                    controller: ['$scope', 'teamsService', 'timerMessageService', '$uibModalInstance',
                        function ($scope, teamsService, timerMessageService, $uibModalInstance) {
                            $scope.card = cardScope.card;
                            $scope.cardSaveButton = "保存";
                            $scope.saveCard = function () {
                                $scope.cardSaveButton = "保存中..";
                                $scope.isDisableCardSaveButton = true;
                                var cardPromise = cardsServices.update($scope.card);
                                cardPromise.then(function (_card) {
                                    timerMessageService.message("配置已经更新");
                                    cardScope.card = _card;
                                    $scope.card = _card;
                                }).finally(function () {
                                    $scope.cardSaveButton = "保存";
                                    $scope.isDisableCardSaveButton = false;
                                });
                            }
                        }],
                    size: 'mid'
                });
            };
            $scope.updateCard = function (_summary, _card) {
                if (_summary === "") {
                    return "卡片描述不能为空";
                }
                var card = _card;
                card.summary = _summary;
                var cardPromise = cardsServices.update(card);
                cardPromise.then(function () {
                });
            };
            $scope.openDeleteModal = function (_message, _link) {
                var currentScope = $scope;
                $uibModal.open({
                    animation: false,
                    templateUrl: 'foundation/modal/partials/confirm-dialog.html',
                    controller: function ($scope, $uibModalInstance) {
                        $scope.title = '警告';
                        $scope.message = "确定要删除" + _message + "吗?";
                        $scope.ok = function () {
                            var _cardDeletePromise = cardsServices.deleteByLink(_link);
                            _cardDeletePromise.then(function () {
                                currentScope.$parent.loadCards();
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

            $scope.isAssigned = function () {
                var userName = localStorageService.get("userName");
                $scope.isIamAssigned = false;
                angular.forEach($scope.assignments, function (_assignment) {
                    if (userName === _assignment.assignee) {
                        $scope.isIamAssigned = true;

                    }
                });
                $scope.assignTip = $scope.isIamAssigned === true ? "我不做了" : "认领";
            };
            $scope.mouseover = function () {
                $scope.isShowCardOperationMenu = true;
            };

            $scope.onMouseLeave = function () {
                $scope.isShowCardOperationMenu = false;
            };
        }]
    };
});


