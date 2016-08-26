/* Services */

kanbanApp.factory('httpServices', ['$http', '$q', 'localStorageService', function ($http, $q, localStorageService) {
    var token = localStorageService.get("token");

    return {
        send: function (_options) {
            var deferred = $q.defer();
            $http({
                method: _options.method,
                url: _options.url,
                data: _options.data,
                contentType: 'application/json'
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(data);
            });
            return deferred.promise;
        },
        post: function (_payload, _url) {
            var deferred = $q.defer();
            $http({
                method: "POST",
                url: _url,
                data: _payload,
                contentType: 'application/json'
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(data);
            });
            return deferred.promise;
        },
        put: function (_payload, _url) {
            var deferred = $q.defer();
            $http({
                method: "PUT",
                url: _url,
                data: _payload,
                contentType: 'application/json'
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(data);
            });
            return deferred.promise;
        },
        delete: function (_url) {
            var deferred = $q.defer();
            $http({
                method: "DELETE",
                url: _url,
                contentType: 'application/json'
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(data);
            });
            return deferred.promise;
        },
        get: function (_url) {
            var deferred = $q.defer();
            $http({
                method: "GET",
                url: _url,
                contentType: 'application/json'
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(data);
            });
            return deferred.promise;
        }
    };
}]);
