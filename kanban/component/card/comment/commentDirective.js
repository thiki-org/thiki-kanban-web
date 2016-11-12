/**
 * Created by xubt on 10/31/16.
 */
kanbanApp.directive('comment', function () {
    return {
        restrict: 'E',
        templateUrl: 'component/card/comment/comment.html',
        replace: true,
        transclude: true,
        scope: {
            comment: '='
        },
        controller: ['$scope', 'localStorageService', 'commentService', 'usersService', function ($scope, localStorageService, commentService, usersService) {
            var avatarPromise = usersService.loadAvatar($scope.comment._links.avatar.href);
            avatarPromise.then(function (_avatar) {
                $scope.avatar = "data:image/png;base64," + _avatar.avatar.replaceAll("\"", "");
            });
            $scope.isShowDeleteButton = false;
            $scope.onMouseOver = function () {
                if ($scope.comment._links.self.actions.delete) {
                    $scope.isShowDeleteButton = true;
                }
            };

            $scope.onMouseLeave = function () {
                $scope.isShowDeleteButton = false;
            };
            $scope.deleteComment = function () {
                var commentPromise = commentService.delete($scope.comment);
                commentPromise.then(function () {
                    $scope.$parent.loadComments();
                });
            };
        }]
    };
});
