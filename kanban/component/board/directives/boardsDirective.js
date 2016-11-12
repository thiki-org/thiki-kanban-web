/**
 * Created by xubt on 5/26/16.
 */

kanbanApp.directive('boardBanner', function () {
    return {
        restrict: 'E',
        templateUrl: 'component/board/partials/board-banner.html',
        replace: true,
        controller: ['$scope', '$location', 'boardsService', 'localStorageService', '$uibModal', function ($scope, $location, boardsService, localStorageService, $uibModal) {
            var boardLink = localStorageService.get("boardLink");
            var boardsLink = localStorageService.get("identity.userName") + '/boards';

            var boardPromise = boardsService.loadBoardByLink(boardLink);
            boardPromise.then(function (_board) {
                $scope.board = _board;
            });
            $scope.toBoards = function () {
                $location.path(boardsLink);
            };
            $scope.updateBoard = function (_name, _board) {
                var board = _board;
                if (_name === "") {
                    return "请输入看板名称";
                }
                board.name = _name;
                boardsService.update(board);
            };
            $scope.mouseover = function () {
                $scope.isDisplaySetting = true;
            };

            $scope.onMouseLeave = function () {
                $scope.isDisplaySetting = false;
            };

            $scope.deleteBoard = function (_board) {
                var thisScope = $scope;
                $uibModal.open({
                    animation: false,
                    templateUrl: 'component/board/partials/delete-board-confirm.html',
                    controller: function ($scope, $uibModalInstance) {
                        $scope.title = '请输入看板名称以确认删除';
                        $scope.board = _board;
                        $scope.ok = function () {
                            var boardPromise = boardsService.deleteBoard(_board);
                            boardPromise.then(function (_data) {
                                thisScope.toBoards();
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
