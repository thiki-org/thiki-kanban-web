/**
 * Created by xubt on 6/18/16.
 */

kanbanApp.run(function (editableOptions, localStorageService) {
    editableOptions.theme = 'bs3';
    localStorageService.set("userId", "341182");
});
kanbanApp.factory('myHttpResponseInterceptor', ['$q', '$location', function ($q, $location) {
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
            console.log(rejection);
            alert("请求出错");
            // do something on error
            if (canRecover(rejection)) {
                return responseOrNewPromise;
            }
            return $q.reject(rejection);
        }
    };
}]);
