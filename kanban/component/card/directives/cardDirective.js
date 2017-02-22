/**
 * Created by xubt on 6/17/16.
 */
kanbanApp.directive('card', function($uibModal) {
    return {
        restrict: 'E',
        templateUrl: 'component/card/partials/card.html',
        replace: true,
        transclude: true,
        scope: {
            card: '=',
            stage: '='
        },
        controller: ['$scope', 'localStorageService', 'assignmentServices', 'cardsServices', 'acceptanceCriteriaService', 'usersService', 'timerMessageService', function($scope, localStorageService, assignmentServices, cardsServices, acceptanceCriteriaService, usersService, timerMessageService) {
            var acceptanceCriterias = $scope.card.acceptanceCriteriasNode === undefined ? [] : $scope.card.acceptanceCriteriasNode.acceptanceCriterias;
            var finishedAcceptanceCriteriasCount = 0;
            for (var index in acceptanceCriterias) {
                if (acceptanceCriterias[index].finished === true) {
                    finishedAcceptanceCriteriasCount++;
                }
            }
            $scope.card.finishedAcceptanceCriteriasCount = finishedAcceptanceCriteriasCount;
            $scope.card.totalAcceptanceCriteriasCount = acceptanceCriterias.length;
            $scope.elapsedDays = parseInt($scope.card.elapsedDays);
            $scope.isIncludHalfDay = $scope.card.elapsedDays % 1 !== 0;
            $scope.assign = function(_card) {
                var thisScope = $scope;
                $uibModal.open({
                    animation: false,
                    templateUrl: 'component/card/partials/assignment-confirm.html',
                    controller: function($scope, $uibModalInstance) {
                        $scope.title = '确认信息';
                        if (thisScope.isIamAssigned) {
                            $scope.message = "你确定不再做该卡片吗?";
                            $scope.ok = function() {
                                var userName = usersService.getCurrentUser().userName;
                                var myAssignmentLink;
                                angular.forEach(thisScope.assignments, function(_assignment) {
                                    if (userName === _assignment.assignee) {
                                        myAssignmentLink = _assignment._links.self.href;
                                    }
                                });
                                var assignmentPromise = assignmentServices.giveUp(myAssignmentLink);
                                assignmentPromise.then(function(_data) {
                                    var index = thisScope.assignments.indexOf(_data);
                                    thisScope.assignments.splice(index, 1);
                                    thisScope.initAssignmentStatus();
                                });
                                $uibModalInstance.close();
                            };
                        } else {
                            $scope.message = "你确定要认领该卡片吗?";
                            $scope.ok = function() {
                                var assignment = {
                                    cardId: _card.id,
                                    assignee: usersService.getCurrentUser().userName,
                                    assigner: usersService.getCurrentUser().userName
                                };

                                var assignmentPromise = assignmentServices.assign(assignment, _card._links.assignments.href);
                                assignmentPromise.then(function(_data) {
                                    thisScope.assignments.push(_data);
                                    thisScope.initAssignmentStatus();
                                });
                                $uibModalInstance.close();
                            };
                        }
                        $scope.cancel = function() {
                            $uibModalInstance.dismiss('cancel');
                        };
                    },
                    size: 'sm'
                });
            };

            var cardScope = $scope;
            $scope.openCardConfiguration = function() {
                $uibModal.open({
                    animation: false,
                    templateUrl: 'component/card/partials/card-configuration.html',
                    controller: ['$scope', 'projectsService', 'timerMessageService', '$uibModalInstance', 'jsonService',
                        function($scope, projectsService, timerMessageService, $uibModalInstance, jsonService) {
                            $scope.card = cardScope.card;
                            $scope.cardSaveButton = "保存";
                            $scope.stage = cardScope.stage;
                            $scope.sizeList = [
                                { id: 1, name: "S" },
                                { id: 2, name: "M" },
                                { id: 3, name: "L" },
                                { id: 5, name: "XL" },
                                { id: 8, name: "XXL" },
                                { id: 9999, name: "∞" }
                            ];
                            $scope.sizeList.selected = jsonService.findById($scope.sizeList, $scope.card.size);

                            $scope.saveCard = function() {
                                $scope.card.size = $scope.sizeList.selected.id;

                                $scope.cardSaveButton = "保存中..";
                                $scope.isDisableCardSaveButton = true;
                                var cardPromise = cardsServices.update($scope.card);
                                cardPromise.then(function(_savedCard) {
                                    $scope.card.code = _savedCard.code;
                                    $scope.card.restDays = _savedCard.restDays;
                                    $scope.card.sizeName = _savedCard.sizeName;
                                    timerMessageService.message("卡片已经更新。");
                                }).finally(function() {
                                    $scope.cardSaveButton = "保存";
                                    $scope.isDisableCardSaveButton = false;
                                });
                            };
                            $scope.$watch('card', function(newValue, oldValue) {
                                if (oldValue === newValue) {
                                    return;
                                }
                                console.log(newValue);
                                $scope.isDisableCardSaveButton = false;
                            });
                            var currentScope = $scope;
                            $scope.displayContentInFullScreen = function() {
                                $uibModal.open({
                                    animation: false,
                                    templateUrl: 'component/card/partials/card-content-full-screen.html',
                                    controller: function($scope) {
                                        $scope.card = currentScope.card;
                                        $scope.stage = currentScope.stage;
                                    },
                                    size: 'fs',
                                    backdrop: "static"
                                });
                            };
                            $scope.cancel = function() {
                                $uibModalInstance.dismiss('cancel');
                            };
                        }
                    ],
                    size: 'card',
                    backdrop: "static"
                });
            };
            $scope.updateCard = function(_summary, _card) {
                if (_summary === "") {
                    return "卡片描述不能为空";
                }
                var card = _card;
                card.summary = _summary;
                var cardPromise = cardsServices.update(card);
                cardPromise.then(function(_savedCard) {

                });
            };
            $scope.openDeleteModal = function(_message, _link) {
                var currentScope = $scope;
                $uibModal.open({
                    animation: false,
                    templateUrl: 'foundation/modal/partials/confirm-dialog.html',
                    controller: function($scope, $uibModalInstance) {
                        $scope.title = '警告';
                        $scope.message = "确定要删除" + _message + "吗?";
                        $scope.ok = function() {
                            cardsServices.deleteByLink(_link).then(function() {
                                currentScope.$parent.removeCard(currentScope.card);
                                timerMessageService.message("卡片已经删除。");
                            });
                            $uibModalInstance.close();
                        };
                        $scope.cancel = function() {
                            $uibModalInstance.dismiss('cancel');
                        };
                    },
                    size: 'sm',
                    backdrop: "static"
                });
            };

            $scope.initAssignmentStatus = function() {
                var userName = usersService.getCurrentUser().userName;
                $scope.isIamAssigned = false;
                angular.forEach($scope.assignments, function(_assignment) {
                    if (userName === _assignment.assignee) {
                        $scope.isIamAssigned = true;
                    }
                });
                $scope.assignTip = $scope.isIamAssigned === true ? "我不做了" : "认领";
                $scope.assignIco = $scope.isIamAssigned === true ? "heart" : "heart-empty";

                $scope.menuOptions = [
                    ['<span class="thiki-menu-ico glyphicon glyphicon-' + $scope.assignIco + '"' + '></span>' + $scope.assignTip, function($itemScope) {
                        $itemScope.assign($itemScope.card);
                    }, function($itemScope) {
                        return !$itemScope.stage.archived;
                    }],
                    null, ['<span class="thiki-menu-ico glyphicon glyphicon-trash thiki-delete-item"></span>删除', function($itemScope) {
                        $itemScope.openDeleteModal($itemScope.card.summary, $itemScope.card._links.self.href);
                    }, function($itemScope) {
                        return !$itemScope.stage.archived;
                    }]
                ];
            };
            $scope.calculateWidth = function(_totalAcceptanceCriteriasCount) {
                if (_totalAcceptanceCriteriasCount === 0) {
                    return 0;
                }
                var width = (100 / _totalAcceptanceCriteriasCount) - 1;
                return (width.toFixed(2) + "%");
            };

            $scope.initAssignmentStatus();
        }]
    };
});