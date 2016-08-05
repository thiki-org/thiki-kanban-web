/**
 * Created by xubt on 6/18/16.
 */
kanbanApp.romote_entrance = "http://localhost:8080/entrance";

kanbanApp.run(function (editableOptions, localStorageService) {
    editableOptions.theme = 'bs3';
    localStorageService.set("userId", "341182");
    localStorageService.set("register", "341182");
});
kanbanApp.factory('httpInterceptor', ['$q', '$injector', 'localStorageService', '$location', function ($q, $injector, localStorageService, $location) {
    var isHasHttpError = false;
    return {
        'request': function (config) {
            var token = localStorageService.get("identity.token");
            var userName = localStorageService.get("identity.userName");
            config.headers.token = token;
            config.headers.userName = userName;
            return config;
        },

        // optional method
        'response': function (response) {
            // do something on success
            return response;
        },

        // optional method
        'responseError': function (rejection) {
            var modal = $injector.get("$uibModal");
            if (isHasHttpError) {
                return $q.reject(rejection);
            }
            isHasHttpError = true;
            modal.open({
                animation: true,
                templateUrl: 'foundation/modal/partials/error-dialog.html',
                controller: function ($scope, $uibModalInstance) {
                    $scope.title = '错误';
                    if (rejection.status === -1) {
                        $scope.message = "网络错误,请确认远程服务器运行正常。";
                    }
                    if (rejection.status === 500) {
                        $scope.title = "500-远程服务器内部错误";
                        $scope.message = rejection.data.message;
                    }
                    if (rejection.status === 400) {
                        $scope.title = '400-参数不合法';
                        $scope.message = rejection.data.message;
                    }
                    if (rejection.status === 401) {
                        $scope.title = '401-访问受限';
                        $scope.message = rejection.data.message;
                    }
                    if (rejection.status === 404) {
                        $scope.title = '404-资源未找到';
                        $scope.message = "资源:" + rejection.config.url;
                    }
                    if (rejection.status === 409) {
                        $scope.title = '409-冲突';
                        $scope.message = rejection.data.message;
                    }
                    $scope.ok = function () {
                        isHasHttpError = false;
                        $uibModalInstance.close();
                        if (rejection.status === 401) {
                            $location.path("/welcome");
                        }
                    };
                },
                size: 'sm'
            });
            return $q.reject(rejection);
        }
    };
}]);
