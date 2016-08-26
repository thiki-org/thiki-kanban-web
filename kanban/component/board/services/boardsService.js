/**
 * Created by xubt on 5/26/16.
 */
kanbanApp.factory('boardsService', ['$http', '$q', 'httpServices',
    function ($http, $q, httpServices) {
        return {
            boardsLink: '',
            load: function (_boardsLink) {
                return httpServices.send({
                    method: 'GET',
                    url: _boardsLink
                });
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
                return httpServices.send({
                    method: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(_board),
                    url: this.boardsLink
                });
            },
            update: function (_board) {
                return httpServices.send({
                    method: 'PUT',
                    contentType: 'application/json',
                    data: JSON.stringify(_board),
                    url: _board._links.self.href
                });
            },
            deleteBoard: function (_board) {
                return httpServices.send({
                    method: 'DELETE',
                    url: _board._links.self.href
                });
            }
        };
    }]);
