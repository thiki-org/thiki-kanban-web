/**
 * Created by xubt on 6/18/16.
 */

kanbanApp.run(function (editableOptions, localStorageService) {
    editableOptions.theme = 'bs3';
    localStorageService.set("userId", "341182");
    localStorageService.set("register", "341182");
});
kanbanApp.factory('httpInterceptor', ['$q', '$injector', function ($q, $injector) {
    return {
        // optional method
        'request': function (config) {
            // do something on success
            return config;
        },

        // optional method
        'requestError': function (rejection) {
            // do something on error
            if (canRecover(rejection)) {
                return responseOrNewPromise;
            }
            return $q.reject(rejection);
        },


        // optional method
        'response': function (response) {
            // do something on success
            return response;
        },

        // optional method
        'responseError': function (rejection) {
            var modal = $injector.get("$uibModal");
            var modalInstance = modal.open({
                animation: true,
                templateUrl: 'foundation/modal/partials/confirm-dialog.html',
                controller: function ($scope, $uibModalInstance) {
                    $scope.title = '连接错误';
                    if (rejection.status === -1) {
                        $scope.message = "网络错误,请确认远程服务器运行正常。";
                    }
                    if (rejection.status === 500) {
                        $scope.message = "500-远程服务器内部发生错误。";
                    }
                    $scope.ok = function () {
                        $uibModalInstance.close();
                    };
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                size: 'sm'
            });
            return $q.reject(rejection);
        }
    };
}]);
