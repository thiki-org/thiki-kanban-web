/* assignmentServices */

kanbanApp.factory('assignmentServices', ['$http', '$q', function ($http, $q) {
    return {
        assign: function (_assignment, _link) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(_assignment),
                headers: {
                    'userId': '112'
                },
                url: _link
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(data);
            });
            return deferred.promise;
        },
        loadAssignments: function (_assignmentLink) {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: _assignmentLink
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(data);
            });
            return deferred.promise;
        },
        giveUp: function (_link) {
            var deferred = $q.defer();
            $http({
                method: 'DELETE',
                contentType: 'application/json',
                headers: {
                    'userId': '112'
                },
                url: _link
            }).success(function (data, status, headers, config) {
                console.log(data);
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(data);
            });
            return deferred.promise;
        }
    };
}]);
