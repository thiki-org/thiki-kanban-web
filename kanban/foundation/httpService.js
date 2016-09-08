/* Services */

kanbanApp.factory('httpServices', ['$http', '$q', '$location', '$injector', 'localStorageService', function ($http, $q, $location, $injector, localStorageService) {
    var token = localStorageService.get("token");

    function openErrorDialog(deferred) {
        var modal = $injector.get("$uibModal");
        modal.open({
            animation: true,
            templateUrl: 'foundation/modal/partials/error-dialog.html',
            controller: function ($scope, $uibModalInstance) {
                $scope.title = '错误';
                $scope.message = "URL错误,请确认本地配置或远程服务器是否运行正常。";

                $scope.ok = function () {
                    $uibModalInstance.close();
                };
            },
            size: 'sm'
        });
        var error = {message: "d"};
        deferred.reject(error);
        return deferred.promise;
    }

    function URLIsNotValid(_url) {
        return _url === undefined || _url === null || _url === "";
    }

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
            if (URLIsNotValid(_url)) {
                return openErrorDialog(deferred);
            }
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
            if (URLIsNotValid(_url)) {
                return openErrorDialog(deferred);
            }
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
            if (URLIsNotValid(_url)) {
                return openErrorDialog(deferred);
            }
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
            if (URLIsNotValid(_url)) {
                return openErrorDialog(deferred);
            }
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
