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
            $scope.openPageCreationDialog = function () {
                $uibModal.open({
                    animation: true,
                    templateUrl: 'component/page/partials/page-dialog.html',
                    controller: ['$scope', 'pagesService', 'timerMessageService', '$uibModalInstance',
                        function ($scope, pagesService, timerMessageService, $uibModalInstance) {
                            $scope.board = currentScope.board;
                            $scope.pageSaveButtonText = "保存";
                            $scope.isDisablePageSaveButton = false;
                            $scope.savePage = function () {
                                $scope.pageSaveButtonText = "保存中..";
                                $scope.isDisablePageSaveButton = true;
                                pagesService.savePage($scope.page, currentScope.board._links.pages.href).then(function (_page) {
                                    currentScope.loadPages();
                                    timerMessageService.message("文章创建成功。");
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
        }]
    };
});
