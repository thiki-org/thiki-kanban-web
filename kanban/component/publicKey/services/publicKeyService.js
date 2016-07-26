/* Services */

kanbanApp.factory('publicKeyServices', ['$http', '$q', function ($http, $q) {
    return {
        loadPublicKey: function (_publicKeyLink) {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: _publicKeyLink
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
