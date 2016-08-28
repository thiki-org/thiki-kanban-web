/**
 * Created by xubt on 4/20/16.
 */

kanbanApp.controller('bannerController', ['$scope', '$aside', 'localStorageService', '$location', '$uibModal',
    function ($scope, $aside, localStorageService, $location, $uibModal) {
        $scope.isShowBanner = true;
        $scope.aside = {
            "title": localStorageService.get("identity.userName"),
            "content": "内容"
        };
        $scope.init = function () {
            if (localStorageService.get("identity.token") === null) {
                $location.path("/welcome");
            }
        };
    }])
;
