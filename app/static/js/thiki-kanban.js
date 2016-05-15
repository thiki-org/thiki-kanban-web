/**
 * Created by xubt on 5/15/16.
 */
var Base64 = {
    _keyStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
    encode: function (e) {
      var t = '';
      var n, r, i, s, o, u, a;
      var f = 0;
      e = Base64._utf8_encode(e);
      while (f < e.length) {
        n = e.charCodeAt(f++);
        r = e.charCodeAt(f++);
        i = e.charCodeAt(f++);
        s = n >> 2;
        o = (n & 3) << 4 | r >> 4;
        u = (r & 15) << 2 | i >> 6;
        a = i & 63;
        if (isNaN(r)) {
          u = a = 64;
        } else if (isNaN(i)) {
          a = 64;
        }
        t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a);
      }
      return t;
    },
    decode: function (e) {
      var t = '';
      var n, r, i;
      var s, o, u, a;
      var f = 0;
      e = e.replace(/[^A-Za-z0-9+\/=]/g, '');
      while (f < e.length) {
        s = this._keyStr.indexOf(e.charAt(f++));
        o = this._keyStr.indexOf(e.charAt(f++));
        u = this._keyStr.indexOf(e.charAt(f++));
        a = this._keyStr.indexOf(e.charAt(f++));
        n = s << 2 | o >> 4;
        r = (o & 15) << 4 | u >> 2;
        i = (u & 3) << 6 | a;
        t = t + String.fromCharCode(n);
        if (u != 64) {
          t = t + String.fromCharCode(r);
        }
        if (a != 64) {
          t = t + String.fromCharCode(i);
        }
      }
      t = Base64._utf8_decode(t);
      return t;
    },
    _utf8_encode: function (e) {
      e = e.replace(/rn/g, 'n');
      var t = '';
      for (var n = 0; n < e.length; n++) {
        var r = e.charCodeAt(n);
        if (r < 128) {
          t += String.fromCharCode(r);
        } else if (r > 127 && r < 2048) {
          t += String.fromCharCode(r >> 6 | 192);
          t += String.fromCharCode(r & 63 | 128);
        } else {
          t += String.fromCharCode(r >> 12 | 224);
          t += String.fromCharCode(r >> 6 & 63 | 128);
          t += String.fromCharCode(r & 63 | 128);
        }
      }
      return t;
    },
    _utf8_decode: function (e) {
      var t = '';
      var n = 0;
      var r = c1 = c2 = 0;
      while (n < e.length) {
        r = e.charCodeAt(n);
        if (r < 128) {
          t += String.fromCharCode(r);
          n++;
        } else if (r > 191 && r < 224) {
          c2 = e.charCodeAt(n + 1);
          t += String.fromCharCode((r & 31) << 6 | c2 & 63);
          n += 2;
        } else {
          c2 = e.charCodeAt(n + 1);
          c3 = e.charCodeAt(n + 2);
          t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
          n += 3;
        }
      }
      return t;
    }
  };
'use strict';
/* App Module */
var config = { localhost: 'http://localhost:8080' };
var kanbanApp = angular.module('kanbanApp', [
    'ngRoute',
    'entriesControllers',
    'entriesServices',
    'ui.sortable',
    'tasksServices'
  ]);
kanbanApp.config([
  '$routeProvider',
  function ($routeProvider) {
    $routeProvider.when('/entries', {
      templateUrl: 'partials/entries.html',
      controller: 'EntriesCtrl'
    }).when('/tasks', {
      templateUrl: 'partials/tasks.html',
      controller: 'TasksCtrl'
    }).otherwise({
      templateUrl: 'partials/entries.html',
      controller: 'EntriesCtrl'
    });
  }
]);
/**
 * Created by xubt on 4/20/16.
 */
var entriesControllers = angular.module('entriesControllers', []);
entriesControllers.controller('EntriesCtrl', [
  '$scope',
  '$q',
  'Entries',
  'Tasks',
  function ($scope, $q, Entries, Tasks) {
    function loadData() {
      var tasks = [];
      var entriesPromise = Entries.load();
      // 同步调用，获得承诺接口var entryTasksPromise
      var entryTasksPromise = [];
      entriesPromise.then(function (data) {
        // 调用承诺API获取数据 .resolve
        $scope.entries = data.entries;
        angular.forEach($scope.entries, function (entry) {
          var _tasksPromise = Tasks.loadTasksByEntryId(entry.id);
          entryTasksPromise.push(_tasksPromise);
        });
        $q.all(entryTasksPromise).then(function (data) {
          for (var index in data) {
            tasks = tasks.concat(data[index]);
          }
          $scope.tasks = tasks;
          $scope.sortableOptions = {
            connectWith: '.tasks',
            opacity: 0.5,
            start: function (e, ui) {
            },
            update: function (e, ui) {
              console.log('===========' + $(ui.item.sortable.droptarget[0]).attr('entry'));
            },
            stop: function (e, ui) {
              console.log(ui.item.scope());
              var targetEntryId = JSON.parse($(ui.item.sortable.droptarget[0]).attr('entry')).id;
              ui.item.sortable.model.entryId = targetEntryId;
              console.log(ui.item.sortable.model);
            }
          };
        });
      });
    }
    loadData();
    $scope.createEntry = function () {
      var title = $scope.entry.title;
      var entry = { title: title };
      var entriesPromise = Entries.create(entry);
      entriesPromise.then(function (data) {
        if ($scope.entries == null) {
          $scope.entries = [];
        }
        $scope.entries.push(data);
        $scope.entry.title = '';
      });
    };
    $scope.showCreateTaskForm = function (entryId) {
      $('#task-create-button-' + entryId).hide();
      $('#task-create-form-' + entryId).show();
    };
    $scope.cancelCreateTask = function (entryId) {
      $('#task-create-form-' + entryId).hide();
      $('#task-create-button-' + entryId).show();
    };
    $scope.cancelCreateEntry = function () {
      $('#create-new-entry-form').hide();
      $('#create-new-entry-button').show();
    };
    $scope.showCreateEntryForm = function () {
      $('#create-new-entry-button').hide();
      $('#create-new-entry-form').show();
    };
    $scope.encode = function (str) {
      return Base64.encode(str);
    };
    $scope.createTask = function (_entryUrl, _entryTasksUrl) {
      var currentEntry = Base64.encode(_entryUrl) + '-title';
      var summary = $('#' + currentEntry).val();
      var task = { summary: summary };
      var taskPromise = Tasks.create(task, _entryTasksUrl);
      taskPromise.then(function (data) {
      });
    };
  }
]);
'use strict';
/* Services */
var entriesServices = angular.module('entriesServices', ['ngResource']);
entriesServices.factory('Entries', [
  '$http',
  '$q',
  function ($http, $q) {
    return {
      load: function () {
        var deferred = $q.defer();
        // 声明延后执行，表示要去监控后面的执行
        // return a Promise object so that the caller can handle success/failure
        $http({
          method: 'GET',
          dataType: 'application/json',
          url: config.localhost + '/entries'
        }).success(function (data, status, headers, config) {
          console.log(data);
          deferred.resolve(data);  // 声明执行成功，即http请求数据成功，可以返回数据了
        }).error(function (data, status, headers, config) {
          deferred.reject(data);  // 声明执行失败，即服务器返回错误
        });
        return deferred.promise;  // 返回承诺，这里并不是最终数据，而是访问最终数据的API
      },
      create: function (_entry) {
        var deferred = $q.defer();
        // 声明延后执行，表示要去监控后面的执行
        // return a Promise object so that the caller can handle success/failure
        $http({
          method: 'POST',
          contentType: 'application/json',
          data: JSON.stringify(_entry),
          headers: { 'userId': '112' },
          url: config.localhost + '/entries'
        }).success(function (data, status, headers, config) {
          console.log(data);
          deferred.resolve(data);  // 声明执行成功，即http请求数据成功，可以返回数据了
        }).error(function (data, status, headers, config) {
          deferred.reject(data);  // 声明执行失败，即服务器返回错误
        });
        return deferred.promise;  // 返回承诺，这里并不是最终数据，而是访问最终数据的API
      }
    };
  }
]);
/**
 * Created by xubt on 4/29/16.
 */
//自定义指令repeatFinish
kanbanApp.directive('repeatFinish', [
  '$timeout',
  function ($timeout) {
    return {
      restrict: 'A',
      link: function (scope, element, attr) {
        if (scope.$last == true) {
          $timeout(function () {
            $('.entryTitle').editable();
            scope.$emit('ngRepeatFinished');
          });
        }
      }
    };
  }
]);
'use strict';
/* Services */
var tasksServices = angular.module('tasksServices', ['ngResource']);
tasksServices.factory('Tasks', [
  '$http',
  '$q',
  function ($http, $q) {
    return {
      loadTasksByEntryId: function (entryId) {
        var deferred = $q.defer();
        // 声明延后执行，表示要去监控后面的执行
        // return a Promise object so that the caller can handle success/failure
        var tasks = [];
        $http({
          method: 'GET',
          url: 'mock/tasks/tasks-' + entryId + '.json'
        }).success(function (data, status, headers, config) {
          tasks = data;
          deferred.resolve(data);  // 声明执行成功，即http请求数据成功，可以返回数据了
        }).error(function (data, status, headers, config) {
          deferred.reject(data);  // 声明执行失败，即服务器返回错误
        });
        return deferred.promise;  // 返回承诺，这里并不是最终数据，而是访问最终数据的API
      },
      create: function (_task, _entryTasksUrl) {
        var deferred = $q.defer();
        // 声明延后执行，表示要去监控后面的执行
        $http({
          method: 'POST',
          contentType: 'application/json',
          data: JSON.stringify(_task),
          headers: { 'userId': '112' },
          url: _entryTasksUrl
        }).success(function (data, status, headers, config) {
          console.log(data);
          deferred.resolve(data);  // 声明执行成功，即http请求数据成功，可以返回数据了
        }).error(function (data, status, headers, config) {
          deferred.reject(data);  // 声明执行失败，即服务器返回错误
        });
        return deferred.promise;  // 返回承诺，这里并不是最终数据，而是访问最终数据的API
      }
    };
  }
]);