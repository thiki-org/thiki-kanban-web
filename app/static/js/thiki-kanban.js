'use strict';
/* App Module */
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
    var tasks = [];
    var entriesPromise = Entries.load();
    // 同步调用，获得承诺接口var entryTasksPromise
    var entryTasksPromise = [];
    entriesPromise.then(function (data) {
      // 调用承诺API获取数据 .resolve
      $scope.entries = data;
      angular.forEach($scope.entries, function (entry) {
        var _tasksPromise = Tasks.loadTasksByEntryId(entry.id);
        entryTasksPromise.push(_tasksPromise);
      });
      $q.all(entryTasksPromise).then(function (data) {
        for (var index in data) {
          tasks = tasks.concat(data[index]);
        }
        console.log(tasks);
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
    $scope.createEntry = function () {
      var title = $scope.title;
      var entry = {
          id: 3333,
          title: title,
          status: 0
        };
      $scope.entries.push(entry);
    };
    $scope.showCreateTaskForm = function (entryId) {
      $('#task-create-button-' + entryId).hide();
      $('#task-create-form-' + entryId).show();
    };
    $scope.cancelCreateTask = function (entryId) {
      $('#task-create-form-' + entryId).hide();
      $('#task-create-button-' + entryId).show();
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
          url: 'mock/entries/entries.json'
        }).success(function (data, status, headers, config) {
          deferred.resolve(data);  // 声明执行成功，即http请求数据成功，可以返回数据了
        }).error(function (data, status, headers, config) {
          deferred.reject(data);  // 声明执行失败，即服务器返回错误
        });
        return deferred.promise;  // 返回承诺，这里并不是最终数据，而是访问最终数据的API
      }  // end query
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
        // return a Promise object so that the caller can handle success/failure
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
      }
    };
  }
]);