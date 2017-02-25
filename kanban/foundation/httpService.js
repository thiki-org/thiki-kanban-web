/* Services */

kanbanApp.factory('httpServices', ['$http', '$q', '$location', '$injector', 'localStorageService', function($http, $q, $location, $injector, localStorageService, CacheFactory) {
    var token = localStorageService.get("token");

    function openErrorDialog(deferred, _url) {
        var modal = $injector.get("$uibModal");
        modal.open({
            animation: true,
            templateUrl: 'foundation/modal/partials/error-dialog.html',
            controller: function($scope, $uibModalInstance) {
                $scope.title = '错误';
                $scope.message = "URL错误:" + _url + "\n请确认本地配置或远程服务器是否运行正常。";

                $scope.ok = function() {
                    $uibModalInstance.close();
                };
            },
            size: 'sm'
        });
        return deferred.promise;
    }

    function URLIsNotValid(_url) {
        return _url === undefined || _url === null || _url === "";
    }

    return {
        send: function(_options) {
            var deferred = $q.defer();
            $http({
                method: _options.method,
                url: _options.url,
                data: _options.data,
                contentType: 'application/json'
            }).then(function successCallback(response) {
                deferred.resolve(response.data);
            }, function errorCallback(response) {
                deferred.reject(response.data);
            });
            return deferred.promise;
        },
        post: function(_payload, _url) {
            var deferred = $q.defer();
            if (URLIsNotValid(_url)) {
                return openErrorDialog(deferred);
            }
            $http({
                method: "POST",
                url: _url,
                data: _payload,
                contentType: 'application/json'
            }).then(function successCallback(response) {
                deferred.resolve(response.data);
            }, function errorCallback(response) {
                deferred.reject(response.data);
            });
            return deferred.promise;
        },
        postWithNoPayLoad: function(_url) {
            var deferred = $q.defer();
            if (URLIsNotValid(_url)) {
                return openErrorDialog(deferred);
            }
            $http({
                method: "POST",
                url: _url
            }).then(function successCallback(response) {
                deferred.resolve(response.data);
            }, function errorCallback(response) {
                deferred.reject(response.data);
            });
            return deferred.promise;
        },
        upload: function(_fileName, _file, _url) {
            var deferred = $q.defer();
            if (URLIsNotValid(_url)) {
                return openErrorDialog(deferred);
            }

            var fileToSend = new FormData();
            fileToSend.append(_fileName, _file);
            $http.post(_url, fileToSend, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            }).then(function successCallback(response) {
                deferred.resolve(response.data);
            }, function errorCallback(response) {
                deferred.reject(response.data);
            });

            return deferred.promise;
        },
        put: function(_payload, _url) {
            var deferred = $q.defer();
            if (URLIsNotValid(_url)) {
                return openErrorDialog(deferred);
            }
            $http({
                method: "PUT",
                url: _url,
                data: _payload,
                contentType: 'application/json'
            }).then(function successCallback(response) {
                deferred.resolve(response.data);
            }, function errorCallback(response) {
                deferred.reject(response.data);
            });
            return deferred.promise;
        },
        putWithNoBody: function(_url) {
            var deferred = $q.defer();
            if (URLIsNotValid(_url)) {
                return openErrorDialog(deferred);
            }
            $http({
                method: "PUT",
                url: _url,
                contentType: 'application/json'
            }).then(function successCallback(response) {
                deferred.resolve(response.data);
            }, function errorCallback(response) {
                deferred.reject(response.data);
            });
            return deferred.promise;
        },
        delete: function(_url) {
            var deferred = $q.defer();
            if (URLIsNotValid(_url)) {
                return openErrorDialog(deferred);
            }
            $http({
                method: "DELETE",
                url: _url,
                contentType: 'application/json'
            }).then(function successCallback(response) {
                deferred.resolve(response.data);
            }, function errorCallback(response) {
                deferred.reject(response.data);
            });
            return deferred.promise;
        },
        get: function(_url, _params) {
            var deferred = $q.defer();
            if (kanbanApp.isCacheUrl(_url)) {
                var cachedResponse = localStorageService.get(_url);
                if (localStorageService.get(_url) !== null) {
                    deferred.resolve(cachedResponse);
                    return deferred.promise;
                }
            }
            if (URLIsNotValid(_url)) {
                return openErrorDialog(deferred, _url);
            }
            $http({
                method: "GET",
                url: _url,
                params: _params,
                contentType: 'application/json'
            }).then(function successCallback(response) {
                deferred.resolve(response.data);
                if (kanbanApp.isCacheUrl(_url)) {
                    localStorageService.set(_url, response.data);
                }
            }, function errorCallback(response) {
                deferred.reject(response.data);
            });
            return deferred.promise;
        },
        getFile: function(_url) {
            var deferred = $q.defer();
            if (kanbanApp.isCacheUrl(_url)) {
                var cachedResponse = localStorageService.get(_url);
                if (localStorageService.get(_url) !== null) {
                    deferred.resolve(cachedResponse);
                    return deferred.promise;
                }
            }
            if (URLIsNotValid(_url)) {
                return openErrorDialog(deferred);
            }
            $http({
                method: "GET",
                url: _url
            }).then(function successCallback(response) {
                deferred.resolve(response.data);
                if (kanbanApp.isCacheUrl(_url)) {
                    localStorageService.set(_url, response.data);
                }
            }, function errorCallback(response) {
                deferred.reject(response.data);
            });
            return deferred.promise;
        }
    };
}]);