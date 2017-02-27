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
                                var userName = usersService.getCurrentUser().userName;
                                var myAssignmentLink;
                                angular.forEach(thisScope.assignments, function (_assignment) {
                                    if (userName === _assignment.assignee) {
                                        myAssignmentLink = _assignment._links.self.href;
                                    }
                                });
                                var assignmentPromise = assignmentServices.giveUp(myAssignmentLink);
                                assignmentPromise.then(function (_data) {
                                    var index = thisScope.assignments.indexOf(_data);
                                    thisScope.assignments.splice(index, 1);
                                });
                                $uibModalInstance.close();
                            };
                        } else {
                            $scope.message = "你确定要认领该卡片吗?";
                            $scope.ok = function () {
                                var assignment = {
                                    cardId: _card.id,
                                    assignee: usersService.getCurrentUser().userName,
                                    assigner: usersService.getCurrentUser().userName
                                };

                                var assignmentPromise = assignmentServices.assign(assignment, _card._links.assignments.href);
                                assignmentPromise.then(function (_data) {
                                    thisScope.assignments.push(_data);
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
                    animation: false,
                    templateUrl: 'component/card/partials/card-configuration.html',
                    controller: ['$scope', 'projectsService', 'timerMessageService', '$uibModalInstance', 'jsonService', 'usersService', 'assignmentServices', 'toaster',
                        function ($scope, projectsService, timerMessageService, $uibModalInstance, jsonService, usersService, assignmentServices, toaster) {
                            if (cardScope.stage.inProcess) {
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
                                }
                                $scope.saveAssignments();
                            };
                            $scope.saveCard = function () {
                                var originParentId = $scope.card.parentId;
                                if (!$scope.card.asChildCard) {
                                    $scope.card.parentId = "";
                                }
                                $scope.card.size = $scope.sizeList.selected.id;
                                $scope.isDisableCardSaveButton = true;
                                var cardPromise = cardsServices.update($scope.card);
                                cardPromise.then(function (_savedCard) {
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
                                });
                            };
                            $scope.saveAssignments = function () {
                                assignmentServices.assign($scope.card.assignmentsNode.assignments, $scope.card.assignmentsNode._links.self.href).then(function () {
                                    toaster.pop('info', "", "分配已经保存。");
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
                        }
                    ],
                    size: 'card',
                    backdrop: "static"
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
                            cardsServices.deleteByLink(_link).then(function () {
                                currentScope.$parent.removeCard(currentScope.card);
                                timerMessageService.message("卡片已经删除。");
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