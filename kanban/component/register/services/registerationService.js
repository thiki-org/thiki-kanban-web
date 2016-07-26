/* Services */

kanbanApp.factory('registrationService', ['$http', '$q', function ($http, $q) {
    return {
        register: function (_registration, _registrationLink) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(_registration),
                url: _registrationLink
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
