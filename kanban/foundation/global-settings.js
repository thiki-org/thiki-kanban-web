/**
 * Created by xubt on 6/18/16.
 */
kanbanApp.run(function (editableOptions) {
    editableOptions.theme = 'bs3';
});
kanbanApp.factory('httpInterceptor', ['$q', '$injector', 'localStorageService', '$location', '$rootScope', function ($q, $injector, localStorageService, $location, $rootScope) {
    var lastErrorCode;
    var lastErrorOccurredTime;
    return {
        'request': function (config) {
            var token = localStorageService.get("identity.token");
            var userName = localStorageService.get("identity.userName");
            config.headers.token = token;
            config.headers.userName = userName;
            return config;
        },

        'response': function (response) {
            if (response.headers().token) {
                localStorageService.set('identity.token', response.headers().token);
            }
            $rootScope.autoExitTime = moment().add(kanbanApp.autoExitTime, "s");
            return response;
        },

        'responseError': function (rejection) {
            if (rejection.status === 404) {
                return $q.reject(rejection);
            }
            //Only allow open one modal within two seconds.
            var twoSecondAgo = moment().add(-3, "s");
            if (lastErrorOccurredTime !== null && lastErrorCode == rejection.status && moment(twoSecondAgo).isBefore(lastErrorOccurredTime)) {
                return $q.reject(rejection);
            }

            if ($location.path() === "/welcome" && rejection.status === 401) {
                return $q.reject(rejection);
            }
            var modal = $injector.get("$uibModal");
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
                    if (rejection.status === 504) {
                        $scope.title = "504-请求超时";
                        $scope.message = "请求超时";
                    }
                    if (rejection.status === 400) {
                        $scope.title = '400-客户端错误';
                        $scope.message = rejection.data.message;
                    }
                    if (rejection.status === 401) {
                        $scope.title = '401-访问受限';
                        $scope.message = rejection.data.message;
                    }

                    if (rejection.status === 405) {
                        $scope.title = '405-方法错误';
                        $scope.message = rejection.data.message;
                    }
                    if (rejection.status === 409) {
                        $scope.title = '409-冲突';
                        $scope.message = rejection.data.message;
                    }
                    $scope.ok = function () {
                        $uibModalInstance.dismiss();
                        if (rejection.status === 401) {
                            if (rejection.data !== undefined && rejection.data.code == 1102) {
                                localStorageService.clearAll();
                                $location.path("/welcome");
                            }
                        }
                    };
                },
                size: 'sm'
            });
            lastErrorCode = rejection.status;
            lastErrorOccurredTime = moment();
            return $q.reject(rejection);
        }
    };
}]);
