/**
 * Created by xubt on 4/20/16.
 */

kanbanApp.controller('bannerController', ['$scope', '$aside', 'localStorageService',
    function ($scope, $aside, localStorageService) {
        $scope.isShowBanner = true;
        $scope.aside = {
            "title": localStorageService.get("identity.userName"),
            "content": "内容"
        };
    }]);
