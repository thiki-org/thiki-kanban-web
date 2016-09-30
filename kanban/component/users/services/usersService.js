/**
 * Created by xubt on 5/26/16.
 */

kanbanApp.factory('usersService', ['$http', '$q', 'localStorageService', 'httpServices',
    function ($http, $q, localStorageService, httpServices) {
        return {
            boardsLink: '',
            getCurrentUser: function () {
                return localStorageService.get("currentUser");
            },
            load: function (_boardsLink) {
                var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行
                $http({
                    method: 'GET',
                    url: _boardsLink
                }).success(function (data, status, headers, config) {
                    deferred.resolve(data);  // 声明执行成功，即http请求数据成功，可以返回数据了
                }).error(function (data, status, headers, config) {
                    deferred.reject(data);   // 声明执行失败，即服务器返回错误
                });
                return deferred.promise;   // 返回承诺，这里并不是最终数据，而是访问最终数据的API
            },
            loadBoardByLink: function (_boardLink) {
                var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行
                $http({
                    method: 'GET',
                    url: _boardLink
                }).success(function (data, status, headers, config) {
                    deferred.resolve(data);  // 声明执行成功，即http请求数据成功，可以返回数据了
                }).error(function (data, status, headers, config) {
                    deferred.reject(data);   // 声明执行失败，即服务器返回错误
                });
                return deferred.promise;   // 返回承诺，这里并不是最终数据，而是访问最终数据的API
            },
            create: function (_board) {
                var deferred = $q.defer();
                $http({
                    method: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(_board),
                    headers: {
                        'userId': '112'
                    },
                    url: this.boardsLink
                }).success(function (data, status, headers, config) {
                    console.log(data);
                    deferred.resolve(data);
                }).error(function (data, status, headers, config) {
                    deferred.reject(data);
                });
                return deferred.promise;
            },
            uploadAvatar: function (_avatar, _avatarLink) {
                return httpServices.upload("avatar", _avatar, _avatarLink);
            },
            loadProfile: function (_profileLinks) {
                return httpServices.get(_profileLinks);
            },
            loadAvatar: function (_avatarLink) {
                return httpServices.getFile(_avatarLink);
            }
        };
    }]);
