/**
 * Created by xubt on 02/11/17.
 */
kanbanApp.directive('pages', function () {
    return {
        restrict: 'E',
        templateUrl: 'component/page/partials/pages.html',
        replace: true,
        scope: false,
        controller: ['$scope', 'pagesService', '$uibModal', 'timerMessageService', function ($scope, pagesService, $uibModal, timerMessageService) {
            $scope.loadPages = function () {
                var loadingInstance = timerMessageService.loading();
                pagesService.loadPages($scope.board._links.pages.href).then(function (_pages) {
                    $scope.pages = _pages;
                    timerMessageService.close(loadingInstance);
                });
            };
            var currentScope = $scope;
            $scope.loadPages();
            $scope.openPageCreationDialog = function (_page) {
                $uibModal.open({
                    animation: true,
                    templateUrl: 'component/page/partials/page-dialog.html',
                    controller: ['$scope', 'pagesService', 'timerMessageService', '$uibModalInstance',
                        function ($scope, pagesService, timerMessageService, $uibModalInstance) {
                            $scope.board = currentScope.board;
                            $scope.pageSaveButtonText = "保存";
                            $scope.isDisablePageSaveButton = false;
                            if (_page !== undefined) {
                                $scope.page = _page;
                            }
                            $scope.savePage = function () {
                                $scope.pageSaveButtonText = "保存中..";
                                $scope.isDisablePageSaveButton = true;
                                pagesService.savePage($scope.page, currentScope.board._links.pages.href).then(function (_page) {
                                    currentScope.loadPages();
                                    timerMessageService.message("文章保存成功。");
                                    $uibModalInstance.dismiss('cancel');
                                }).finally(function () {
                                    $scope.pageSaveButtonText = "保存";
                                    $scope.isDisablePageSaveButton = false;
                                });
                            };
                        }],
                    size: 'page',
                    backdrop: "static"
                });
            };
            $scope.displayPage = function (_page) {
                $uibModal.open({
                    animation: true,
                    templateUrl: 'component/page/partials/page-display.html',
                    controller: ['$scope', 'pagesService', 'timerMessageService', '$uibModalInstance',
                        function ($scope) {
                            $scope.page = _page;
                        }],
                    size: 'fs',
                    backdrop: "static"
                });
            };
            $scope.openPageDeleteDialog = function (_page) {
                $uibModal.open({
                    animation: false,
                    templateUrl: 'foundation/modal/partials/confirm-dialog.html',
                    controller: function ($scope, $uibModalInstance) {
                        $scope.title = '警告';
                        $scope.message = "确定要移除文章 " + _page.title + " 吗?";
                        $scope.ok = function () {
                            pagesService.removePage(_page).then(function () {
                                currentScope.loadPages();
                                timerMessageService.message("文章已经成功移除。");
                                $uibModalInstance.dismiss('cancel');
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
        }]
    };
});
