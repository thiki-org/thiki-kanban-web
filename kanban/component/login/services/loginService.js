/* Services */

kanbanApp.factory('loginService', ['$http', '$q', function ($http, $q) {
    return {
        login: function (_loginLink, _identity, _password) {
            var deferred = $q.defer();
            $http({
                method: 'get',
                params: {identity: _identity, password: _password},
                url: _loginLink
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
