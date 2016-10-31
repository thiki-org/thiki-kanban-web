/* Services */

kanbanApp.factory('proceduresServices', ['$http', '$q', 'httpServices',
    function ($http, $q, httpServices) {
        return {
            proceduresLink: '',
            load: function () {
                var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行

                // return a Promise object so that the caller can handle success/failure
                $http({
                    method: 'GET',
                    dataType: 'application/json',
                    url: this.proceduresLink
                }).success(function (data, status, headers, config) {
                    deferred.resolve(data);  // 声明执行成功，即http请求数据成功，可以返回数据了
                }).error(function (data, status, headers, config) {
                    deferred.reject(data);   // 声明执行失败，即服务器返回错误
                });
                return deferred.promise;   // 返回承诺，这里并不是最终数据，而是访问最终数据的API
            },

            create: function (_procedure) {
                var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行

                // return a Promise object so that the caller can handle success/failure
                $http({
                    method: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(_procedure),
                    url: this.proceduresLink
                }).success(function (data, status, headers, config) {
                    deferred.resolve(data);  // 声明执行成功，即http请求数据成功，可以返回数据了
                }).error(function (data, status, headers, config) {
                    deferred.reject(data);   // 声明执行失败，即服务器返回错误
                });
                return deferred.promise;   // 返回承诺，这里并不是最终数据，而是访问最终数据的API
            },
            update: function (_procedure) {
                var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行

                // return a Promise object so that the caller can handle success/failure
                $http({
                    method: 'PUT',
                    contentType: 'application/json',
                    data: JSON.stringify(_procedure),
                    url: _procedure._links.self.href
                }).success(function (data, status, headers, config) {
                    deferred.resolve(data);  // 声明执行成功，即http请求数据成功，可以返回数据了
                }).error(function (data, status, headers, config) {
                    deferred.reject(data);   // 声明执行失败，即服务器返回错误
                });
                return deferred.promise;   // 返回承诺，这里并不是最终数据，而是访问最终数据的API
            },
            deleteByLink: function (_link) {
                var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行

                $http({
                    method: 'DELETE',
                    contentType: 'application/json',
                    url: _link
                }).success(function (data, status, headers, config) {
                    deferred.resolve(data);  // 声明执行成功，即http请求数据成功，可以返回数据了
                }).error(function (data, status, headers, config) {
                    deferred.reject(data);   // 声明执行失败，即服务器返回错误
                });
                return deferred.promise;   // 返回承诺，这里并不是最终数据，而是访问最终数据的API
            },
            resort: function (_procedures, _resortLink) {
                return httpServices.put(_procedures, _resortLink);
            }
        };
    }]);
