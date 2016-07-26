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
                contentType: _options.contentType
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(data);
            });
            return deferred.promise;
        }
    };
}]);
