/**
 * Created by xubt on 10/18/16.
 */
kanbanApp.directive('acceptanceCriteria', function () {
    return {
        restrict: 'E',
        templateUrl: 'component/card/acceptanceCriteria/partials/acceptanceCriteria.html',
        replace: true,
        transclude: true,
        scope: {
            acceptanceCriteria: '=',
            stage: '='
        },
        controller: ['$scope', 'localStorageService', 'acceptanceCriteriaService', 'timerMessageService', 'toaster', '$uibModal', function ($scope, localStorageService, acceptanceCriteriaService, timerMessageService, toaster, $uibModal) {
            $scope.$watch('acceptanceCriteria.finished', function (newValue, oldValue) {
                if (oldValue === newValue) {
                    return;
                }
                $scope.$parent.updateAcceptanceCriteriasCount();
                acceptanceCriteriaService.update($scope.acceptanceCriteria);
            });
            $scope.updateAcceptanceCriteria = function (_summary) {
                $scope.acceptanceCriteria.summary = _summary;
                var loadingInstance = timerMessageService.loading();
                acceptanceCriteriaService.update($scope.acceptanceCriteria).then(function (_acceptanceCriteria) {
                    $scope.acceptanceCriteria = _acceptanceCriteria;
                    $scope.$parent.updateAcceptanceCriteria(_acceptanceCriteria);
                    toaster.pop('info', "", "已经保存。");
                }).finally(function () {
                    timerMessageService.delayClose(loadingInstance);
                });
            };

            $scope.isShowDeleteButton = false;
            $scope.onMouseOver = function () {
                $scope.isShowDeleteButton = true;
            };

            $scope.onMouseLeave = function () {
                $scope.isShowDeleteButton = false;
            };
            $scope.deleteAcceptanceCriteria = function () {
                var loadingInstance = timerMessageService.loading();
                acceptanceCriteriaService.delete($scope.acceptanceCriteria).then(function () {
                    $scope.$parent.deleteAcceptanceCriteria($scope.acceptanceCriteria);
                    toaster.pop('info', "", "验收标准已经删除。");
                }).finally(function () {
                    timerMessageService.delayClose(loadingInstance);
                });
            };
            var acceptanceCriteriaScope = $scope;

            $scope.loadVerifications = function () {
                acceptanceCriteriaService.loadVerifications($scope.acceptanceCriteria._links.verifications.href)
                    .then(function (_verificationsNode) {
                        $scope.isShowAllVerifications = false;
                        $scope.verifications = _verificationsNode.verifications;
                    });
            };
            $scope.loadVerifications();
            $scope.openVerificationModal = function () {
                $uibModal.open({
                    animation: false,
                    templateUrl: 'component/card/acceptanceCriteria/partials/verification-creation.html',
                    controller: ['$scope', 'timerMessageService', '$uibModalInstance', 'jsonService', 'acceptanceCriteriaService', 'toaster',
                        function ($scope, timerMessageService, $uibModalInstance, jsonService, acceptanceCriteriaService, toaster) {
                            $scope.verificationResultTypes = [
                                {id: 1, name: "通过"},
                                {id: -1, name: "未通过"}
                            ];
                            $scope.isDisableVerificationSaveButton = false;
                            $scope.verificationSaveButton = "提交";
                            $scope.acceptanceCriteria = acceptanceCriteriaScope.acceptanceCriteria;
                            $scope.submitVerification = function () {
                                var loadingInstance = timerMessageService.loading();
                                $scope.verification.isPassed = $scope.verificationResultTypes.selected.id;
                                $scope.verification.acceptanceCriteriaId = acceptanceCriteriaScope.acceptanceCriteria.id;
                                acceptanceCriteriaService.submitVerification($scope.verification, acceptanceCriteriaScope.acceptanceCriteria._links.verifications.href)
                                    .then(function (_verifications) {
                                        var verificationsNode = {verifications: _verifications};
                                        acceptanceCriteriaScope.acceptanceCriteria.verificationsNode = verificationsNode;
                                        acceptanceCriteriaScope.verifications = _verifications.verifications;
                                        acceptanceCriteriaScope.loadVerifications();
                                        acceptanceCriteriaScope.acceptanceCriteria.isPassed = $scope.verification.isPassed;
                                        $uibModalInstance.dismiss('cancel');
                                        toaster.pop('info', "", "验收记录已成功提交。");
                                    }).finally(function () {
                                    timerMessageService.delayClose(loadingInstance);
                                });
                            };
                        }
                    ],
                    size: 'verification',
                    backdrop: "static"
                });
            };
        }]
    };
});
