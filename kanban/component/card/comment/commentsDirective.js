/**
 * Created by xubt on 10/31/16.
 */
kanbanApp.directive('comments', function ($uibModal) {
    return {
        restrict: 'E',
        templateUrl: 'component/card/comment/comments.html',
        replace: true,
        transclude: true,
        scope: {
            card: '='
        },
        controller: ['$scope', 'localStorageService', 'commentService', 'cardsServices', function ($scope, localStorageService, commentService, cardsServices) {
            $scope.commentSaveButton = "保存";
            $scope.isShowCommentForm = false;
            $scope.isShowCommentCreationButton = true;

            $scope.loadComments = function () {
                var comments = commentService.loadComments($scope.card._links.comments.href);
                comments.then(function (_comments) {
                    $scope.comments = _comments.comments;
                    $scope.commentCount = $scope.comments.length;
                });
            };
            $scope.loadComments();
            $scope.isShowcommentCreationButton = true;
            $scope.isDisableCommentSaveButton = false;
            $scope.openCommentCreationForm = function () {
                $scope.isShowCommentForm = true;
                $scope.isShowCommentCreationButton = false;
            };

            $scope.addCommentCreation = function () {
                $scope.isShowCommentCreationButton = false;
                $scope.isDisableCommentSaveButton = true;
                $scope.commentSaveButton = "保存中..";

                var comment = {summary: $scope.commentSummary};
                var commentPromise = commentService.create(comment, $scope.card._links.comments.href);
                commentPromise.then(function (_comment) {
                    $scope.loadComments();
                    $scope.isShowCommentForm = false;
                    $scope.isShowCommentCreationButton = true;
                    $scope.commentSummary = "";
                }).finally(function () {
                    $scope.commentSaveButton = "保存";
                    $scope.isDisableCommentSaveButton = false;
                });
            };

            $scope.cancelCreateComment = function () {
                $scope.isShowCommentForm = false;
                $scope.commentSummary = "";
                $scope.isShowCommentCreationButton = true;
            }
        }]
    };
});


