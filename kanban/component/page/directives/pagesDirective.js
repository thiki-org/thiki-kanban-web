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
                pagesService.loadPages($scope.board._links.pages.href).then(function (_pages) {
                    $scope.pages = _pages;
                });
            };
            var currentScope = $scope;
            $scope.loadPages();
            $scope.openPageCreationDialog = function () {
                $uibModal.open({
                    animation: true,
                    templateUrl: 'component/page/partials/page-dialog.html',
                    controller: ['$scope', 'boardsService', 'timerMessageService',
                        function ($scope) {
                            $scope.board = currentScope.board;
                        }],
                    size: 'page',
                    backdrop: "static"
                });
            };
        }]
    };
});

kanbanApp.filter('markdown', function () {
    var converter = showdown.Converter();
    return converter.makeHtml;
});
