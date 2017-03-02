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
            card: '=',
            stage: '=',
            board: '='
        },
        controller: ['$scope', 'localStorageService', 'assignmentServices', 'cardsServices', 'acceptanceCriteriaService', 'usersService', 'timerMessageService', function ($scope, localStorageService, assignmentServices, cardsServices, acceptanceCriteriaService, usersService, timerMessageService) {
            var acceptanceCriterias = $scope.card.acceptanceCriteriasNode === undefined ? [] : $scope.card.acceptanceCriteriasNode.acceptanceCriterias;
            var finishedAcceptanceCriteriasCount = 0;
            for (var index in acceptanceCriterias) {
                if (acceptanceCriterias[index].finished === true) {
                    finishedAcceptanceCriteriasCount++;
                }
            }
            $scope.card.finishedAcceptanceCriteriasCount = finishedAcceptanceCriteriasCount;
            $scope.card.totalAcceptanceCriteriasCount = acceptanceCriterias.length;
            $scope.card.finished = $scope.card.finishedAcceptanceCriteriasCount === $scope.card.totalAcceptanceCriteriasCount;
            $scope.childCards = $scope.card.child === undefined ? [] : $scope.card.child.cards;
            $scope.elapsedDays = parseInt($scope.card.elapsedDays);
            $scope.isIncludHalfDay = $scope.card.elapsedDays % 1 !== 0;
            var cardScope = $scope;
            $scope.openCardConfiguration = function () {
                $uibModal.open({
                    animation: false,
                    templateUrl: 'component/card/partials/card-configuration.html',
                    controller: ['$scope', 'projectsService', 'timerMessageService', '$uibModalInstance', 'jsonService', 'usersService', 'assignmentServices', 'toaster',
                        function ($scope, projectsService, timerMessageService, $uibModalInstance, jsonService, usersService, assignmentServices, toaster) {
                            if (cardScope.stage.inSprint && !cardScope.stage.inDoneStatus) {
                                $scope.isInCardConfiguration = true;
                            }
                            $scope.card = cardScope.card;
                            $scope.board = cardScope.board;
                            $scope.cardSaveButton = "保存";
                            $scope.stage = cardScope.stage;
                            $scope.sizeList = [
                                {id: 1, name: "S"},
                                {id: 2, name: "M"},
                                {id: 3, name: "L"},
                                {id: 5, name: "XL"},
                                {id: 8, name: "XXL"},
                                {id: 9999, name: "不可估算"}
                            ];
                            $scope.sizeList.selected = jsonService.findById($scope.sizeList, $scope.card.size);

                            $scope.selectMember = function (_selectedMember) {
                                var newAssignment = {
                                    assigner: usersService.getCurrentUser().userName,
                                    assignee: _selectedMember.userName,
                                    cardId: $scope.card.id,
                                    _links: {assigneeAvatar: _selectedMember._links.avatar}
                                };
                                if (!jsonService.contains(cardScope.assignments, "assignee", _selectedMember.userName)) {
                                    $scope.card.assignmentsNode.assignments.push(newAssignment);
                                    $scope.saveAssignments();
                                }
                            };
                            $scope.saveCard = function () {
                                var originParentId = $scope.card.parentId;
                                if (!$scope.card.asChildCard) {
                                    $scope.card.parentId = "";
                                }
                                $scope.card.size = $scope.sizeList.selected.id;
                                $scope.loadingInstance = timerMessageService.loading();
                                cardsServices.update($scope.card).then(function (_savedCard) {
                                    $scope.card.code = _savedCard.code;
                                    $scope.card.restDays = _savedCard.restDays;
                                    $scope.card.sizeName = _savedCard.sizeName;
                                    if ($scope.card.asChildCard === false) {
                                        for (var index in $scope.stage.cardsNode.cards) {
                                            if ($scope.stage.cardsNode.cards[index].id === originParentId) {
                                                var childCardIndex = $scope.stage.cardsNode.cards[index].child.cards.indexOf($scope.card);
                                                $scope.stage.cardsNode.cards[index].child.cards.splice(childCardIndex, 1);
                                                $scope.stage.cardsNode.cards.push($scope.card);
                                                $scope.card.parentId = undefined;
                                                break;
                                            }
                                        }
                                    }
                                    toaster.pop('info', "", "卡片已保存。");
                                }).finally(function () {
                                    timerMessageService.close($scope.loadingInstance);
                                });
                            };
                            $scope.saveAssignments = function () {
                                $scope.loadingInstance = timerMessageService.loading();
                                assignmentServices.assign($scope.card.assignmentsNode.assignments, $scope.card.assignmentsNode._links.self.href).then(function () {
                                    toaster.pop('info', "", "分配已经保存，并通知相关成员。");
                                }).finally(function () {
                                    timerMessageService.close($scope.loadingInstance);
                                });
                            };
                            var currentScope = $scope;
                            $scope.displayContentInFullScreen = function () {
                                $uibModal.open({
                                    animation: false,
                                    templateUrl: 'component/card/partials/card-content-full-screen.html',
                                    controller: function ($scope) {
                                        $scope.card = currentScope.card;
                                        $scope.stage = currentScope.stage;
                                    },
                                    size: 'fs',
                                    backdrop: "static"
                                });
                            };

                            $scope.cancel = function () {
                                $uibModalInstance.dismiss('cancel');
                            };
                            $scope.removeCard = function (_card) {
                                var index = cardScope.stage.cardsNode.cards.indexOf(_card);
                                cardScope.stage.cardsNode.cards.splice(index, 1);
                            };
                            $scope.openDeleteModal = function () {
                                $uibModal.open({
                                    animation: true,
                                    templateUrl: 'foundation/modal/partials/confirm-dialog.html',
                                    controller: function ($scope, $uibModalInstance) {
                                        $scope.title = '警告';
                                        $scope.buttonText = "确认";
                                        $scope.message = "你是否确定要删除本张卡片?";
                                        $scope.ok = function () {
                                            cardsServices.deleteByLink(currentScope.card._links.self.href).then(function () {
                                                currentScope.removeCard(currentScope.card);
                                                timerMessageService.message("卡片已经删除。");
                                                currentScope.cancel();
                                            });
                                            $uibModalInstance.close();
                                        };
                                        $scope.cancel = function () {
                                            $uibModalInstance.dismiss('cancel');
                                        };
                                    },
                                    size: 'sm',
                                    backdrop: "static"
                                });
                            };
                        }
                    ],
                    size: 'card',
                    backdrop: "static"
                });
            };
            $scope.calculateWidth = function (_totalAcceptanceCriteriasCount) {
                if (_totalAcceptanceCriteriasCount === 0) {
                    return 0;
                }
                var width = (100 / _totalAcceptanceCriteriasCount) - 1;
                return (width.toFixed(2) + "%");
            };

            $scope.$watch(function () {
                return localStorageService.get("isCardDragging");
            }, function (newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                }
                $scope.isCardDragging = localStorageService.get("isCardDragging");
            }, true);
        }]
    };
});