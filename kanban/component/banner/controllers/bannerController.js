/**
 * Created by xubt on 4/20/16.
 */

kanbanApp.controller('bannerController', ['$scope', '$aside', 'localStorageService', '$location',
    function ($scope, $aside, localStorageService, $location) {
        $scope.isShowBanner = true;
        $scope.init = function () {
            if (localStorageService.get("identity.token") === null) {
                $location.path("/welcome");
            }
        };
    }]);
