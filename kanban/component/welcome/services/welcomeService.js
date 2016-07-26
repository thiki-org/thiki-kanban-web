/* Services */

kanbanApp.factory('welcomeServices', ['$http', '$q', function ($http, $q) {
    return {
        loadEntrance: function (_entranceUrl) {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: _entranceUrl
            }).success(function (data, status, headers, config) {
                tasks = data;
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(data);
            });
            return deferred.promise;
        }
    };
}]);
