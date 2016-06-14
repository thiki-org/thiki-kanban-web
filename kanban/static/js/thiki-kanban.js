'use strict';
/* App Module */
var config = { localhost: 'http://localhost:8080' };
var kanbanApp = angular.module('kanbanApp', [
    'ngRoute',
    'ngAnimate',
    'ui.bootstrap',
    'boardController',
    'entriesServices',
    'ui.sortable',
    'tasksServices',
    'boardsService'
  ]);
kanbanApp.config([
  '$routeProvider',
  function ($routeProvider) {
    $routeProvider.when('/entries', {
      templateUrl: 'board/partials/boards.html',
      controller: 'EntriesCtrl'
    }).when('/boards/:boardId/entries', { templateUrl: 'entry/partials/entries.html' }).when('/boards', {
      templateUrl: 'board/partials/boards.html',
      controller: 'boardController'
    }).otherwise({
      templateUrl: 'board/partials/boards.html',
      controller: 'boardController'
    });
  }
]);
/**
 * Created by xubt on 4/20/16.
 */
var boardController = angular.module('boardController', []);
var boardsLink = 'http://localhost:8080/boards';
boardController.controller('boardController', [
  '$scope',
  '$location',
  '$q',
  'boardsService',
  function ($scope, $location, $q, boardsService) {
    var boardPromise = boardsService.load(boardsLink);
    boardsService.boardsLink = boardsLink;
    boardPromise.then(function (data) {
      $scope.boards = data;
    });
    $scope.toEntries = function (_boardId, _boardLink) {
      $location.path('/boards/' + _boardId + '/entries').search({ boardLink: _boardLink });
    };
    $scope.displayBoardCreationForm = true;
    $scope.displayForm = false;
    $scope.createBoard = function () {
      var name = $scope.board.name;
      var board = { name: name };
      var entriesPromise = boardsService.create(board);
      entriesPromise.then(function (data) {
        if ($scope.boards == null) {
          $scope.boards = [];
        }
        $scope.boards.push(data);
        $scope.board.name = '';
      });
    };
    $scope.keyPress = function ($event) {
      if ($event.keyCode == 13) {
        $scope.createBoard();
      }
      if ($event.keyCode == 27) {
        $scope.cancelCreateBoard();
      }
    };
    $scope.showBoardCreationForm = function () {
      $scope.displayBoardCreationForm = false;
      $scope.displayForm = true;
    };
    $scope.cancelCreateBoard = function () {
      $scope.displayBoardCreationForm = true;
      $scope.displayForm = false;
    };
  }
]);
/**
 * Created by xubt on 5/26/16.
 */
kanbanApp.directive('boardBanner', [
  '$timeout',
  function ($timeout) {
    return {
      restrict: 'E',
      templateUrl: 'board/partials/board-banner.html',
      replace: false,
      controller: [
        '$scope',
        '$routeParams',
        '$location',
        'boardsService',
        function ($scope, $routeParams, $location, boardsService) {
          var boardLink = $routeParams.boardLink;
          var boardPromise = boardsService.loadBoardByLink(boardLink);
          boardPromise.then(function (_board) {
            $scope.board = _board;
          });
          $scope.toBoards = function () {
            $location.path('/boards');
          };
        }
      ]
    };
  }
]);
/**
 * Created by xubt on 5/26/16.
 */
var boardsService = angular.module('boardsService', ['ngResource']);
boardsService.factory('boardsService', [
  '$http',
  '$q',
  function ($http, $q) {
    return {
      boardsLink: '',
      load: function (_boardsLink) {
        var deferred = $q.defer();
        // 声明延后执行，表示要去监控后面的执行
        $http({
          method: 'GET',
          url: _boardsLink
        }).success(function (data, status, headers, config) {
          deferred.resolve(data);  // 声明执行成功，即http请求数据成功，可以返回数据了
        }).error(function (data, status, headers, config) {
          deferred.reject(data);  // 声明执行失败，即服务器返回错误
        });
        return deferred.promise;  // 返回承诺，这里并不是最终数据，而是访问最终数据的API
      },
      loadBoardByLink: function (_boardLink) {
        var deferred = $q.defer();
        // 声明延后执行，表示要去监控后面的执行
        $http({
          method: 'GET',
          url: _boardLink
        }).success(function (data, status, headers, config) {
          deferred.resolve(data);  // 声明执行成功，即http请求数据成功，可以返回数据了
        }).error(function (data, status, headers, config) {
          deferred.reject(data);  // 声明执行失败，即服务器返回错误
        });
        return deferred.promise;  // 返回承诺，这里并不是最终数据，而是访问最终数据的API
      },
      create: function (_board) {
        var deferred = $q.defer();
        $http({
          method: 'POST',
          contentType: 'application/json',
          data: JSON.stringify(_board),
          headers: { 'userId': '112' },
          url: this.boardsLink
        }).success(function (data, status, headers, config) {
          console.log(data);
          deferred.resolve(data);
        }).error(function (data, status, headers, config) {
          deferred.reject(data);
        });
        return deferred.promise;
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
kanbanApp.directive('entryCreation', [
  '$timeout',
  function ($timeout) {
    return {
      restrict: 'E',
      templateUrl: 'entry/partials/entry-creation.html',
      replace: true,
      controller: [
        '$scope',
        'entriesServices',
        function ($scope, entriesServices) {
          $scope.createEntry = function () {
            var title = $scope.entry.title;
            var entry = {
                title: title,
                boardId: $scope.board.id
              };
            var entriesPromise = entriesServices.create(entry);
            entriesPromise.then(function (data) {
              if ($scope.entries == null) {
                $scope.entries = [];
              }
              $scope.entries.push(data);
              $scope.entry.title = '';
            });
          };
          $scope.displayCreationButton = true;
          $scope.displayForm = false;
          $scope.cancelCreateEntry = function () {
            $scope.displayCreationButton = true;
            $scope.displayForm = false;
          };
          $scope.showCreateEntryForm = function () {
            $scope.displayCreationButton = false;
            $scope.displayForm = true;
          };
          $scope.keyPress = function ($event) {
            if ($event.keyCode == 13) {
              $scope.createEntry();
            }
            if ($event.keyCode == 27) {
              $scope.cancelCreateEntry();
            }
          };
        }
      ]
    };
  }
]);
kanbanApp.directive('entry', [
  '$timeout',
  function ($timeout) {
    return {
      restrict: 'E',
      templateUrl: 'entry/partials/entry.html',
      replace: true,
      controller: [
        '$scope',
        '$routeParams',
        'boardsService',
        'entriesServices',
        'tasksServices',
        function ($scope, $routeParams, boardsService, entriesServices, tasksServices) {
          function loadEntries() {
            var tasks = [];
            var boardLink = $routeParams.boardLink;
            var boardPromise = boardsService.loadBoardByLink(boardLink);
            boardPromise.then(function (_board) {
              $scope.board = _board;
              entriesServices.entriesLink = _board._links.entries.href;
              var entriesPromise = entriesServices.load(_board._links.entries.href);
              entriesPromise.then(function (data) {
                $scope.entries = data;
                $scope.sortableOptions = {
                  connectWith: '.tasks',
                  opacity: 0.5,
                  start: function (e, ui) {
                  },
                  update: function (e, ui) {
                    console.log(ui.item.scope());
                    var targetEntryId = $(ui.item.sortable.droptarget[0]).parent().attr('entryId');
                    ui.item.sortable.model.entryId = targetEntryId;
                    ui.item.sortable.model.orderNumber = ui.item.sortable.dropindex;
                    console.log(ui.item.sortable.model);
                    var _tasksPromise = tasksServices.update(ui.item.sortable.model);
                    _tasksPromise.then(function (data) {
                      loadEntries();
                    });
                  },
                  stop: function (e, ui) {
                  }
                };
              });
            });
          }
          loadEntries();
        }
      ]
    };
  }
]);
'use strict';
/* Services */
var entriesServices = angular.module('entriesServices', ['ngResource']);
entriesServices.factory('entriesServices', [
  '$http',
  '$q',
  function ($http, $q) {
    return {
      entriesLink: '',
      load: function () {
        var deferred = $q.defer();
        // 声明延后执行，表示要去监控后面的执行
        // return a Promise object so that the caller can handle success/failure
        $http({
          method: 'GET',
          dataType: 'application/json',
          url: this.entriesLink
        }).success(function (data, status, headers, config) {
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
          url: this.entriesLink
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
 * Created by xubt on 5/26/16.
 */
kanbanApp.directive('tasks', [
  '$uibModal',
  function ($uibModal) {
    return {
      restrict: 'E',
      templateUrl: 'task/partials/tasks.html',
      replace: true,
      controller: [
        '$scope',
        'tasksServices',
        function ($scope, tasksServices) {
          loadTasks();
          function loadTasks() {
            var entry = $scope.entry;
            var _tasksPromise = tasksServices.loadTasksByEntryId(entry._links.tasks.href);
            _tasksPromise.then(function (data) {
              $scope.tasks = data;
            });
            $scope.open = function (_message, _link) {
              $uibModal.open({
                animation: false,
                templateUrl: 'foundation/modal/partials/confirm-dialog.html',
                controller: [
                  '$scope',
                  '$uibModalInstance',
                  function ($scope, $uibModalInstance) {
                    $scope.title = '\u8b66\u544a';
                    $scope.message = '\u786e\u5b9a\u8981\u5220\u9664' + _message + '\u5417?';
                    $scope.ok = function () {
                      var _taskDeletePromise = tasksServices.deleteByLink(_link);
                      _taskDeletePromise.then(function () {
                        loadTasks();
                      });
                      $uibModalInstance.close();
                    };
                    $scope.cancel = function () {
                      $uibModalInstance.dismiss('cancel');
                    };
                  }
                ],
                size: 'sm'
              });
            };
          }
        }
      ]
    };
  }
]);
angular.module('kanbanApp').controller('ModalInstanceCtrl', [
  '$scope',
  '$uibModalInstance',
  function ($scope, $uibModalInstance) {
    $scope.ok = function () {
      $uibModalInstance.close();
    };
    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  }
]);
kanbanApp.directive('taskCreation', [
  '$timeout',
  function ($timeout) {
    return {
      restrict: 'E',
      templateUrl: 'task/partials/task-creation.html',
      controller: [
        '$scope',
        'tasksServices',
        function ($scope, tasksServices) {
          var entry = $scope.entry;
          $scope.displayCreationButton = true;
          $scope.displayForm = false;
          $scope.showCreateTaskForm = function () {
            $scope.displayCreationButton = false;
            $scope.displayForm = true;
            $scope.summary = '';
          };
          $scope.cancelCreateTask = function () {
            $scope.displayCreationButton = true;
            $scope.displayForm = false;
          };
          $scope.createTask = function () {
            var task = {
                summary: $scope.summary,
                entryId: entry.id
              };
            var taskPromise = tasksServices.create(task, entry._links.tasks.href);
            taskPromise.then(function (data) {
              var _tasksPromise = tasksServices.loadTasksByEntryId(entry._links.tasks.href);
              _tasksPromise.then(function (data) {
                $scope.tasks = data;
                $scope.displayCreationButton = true;
                $scope.displayForm = false;
              });
            });
          };
          $scope.keyPress = function ($event) {
            if ($event.keyCode == 13) {
              $scope.createTask();
            }
            if ($event.keyCode == 27) {
              $scope.cancelCreateTask();
            }
          };
        }
      ]
    };
  }
]);
'use strict';
/* Services */
var tasksServices = angular.module('tasksServices', ['ngResource']);
tasksServices.factory('tasksServices', [
  '$http',
  '$q',
  function ($http, $q) {
    return {
      loadTasksByEntryId: function (tasksUrl) {
        var deferred = $q.defer();
        // 声明延后执行，表示要去监控后面的执行
        // return a Promise object so that the caller can handle success/failure
        var tasks = [];
        $http({
          method: 'GET',
          url: tasksUrl
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
      },
      update: function (_task) {
        var deferred = $q.defer();
        // 声明延后执行，表示要去监控后面的执行
        $http({
          method: 'PUT',
          contentType: 'application/json',
          data: JSON.stringify(_task),
          headers: { 'userId': '112' },
          url: _task._links.self.href
        }).success(function (data, status, headers, config) {
          console.log(data);
          deferred.resolve(data);  // 声明执行成功，即http请求数据成功，可以返回数据了
        }).error(function (data, status, headers, config) {
          deferred.reject(data);  // 声明执行失败，即服务器返回错误
        });
        return deferred.promise;  // 返回承诺，这里并不是最终数据，而是访问最终数据的API
      },
      deleteByLink: function (_link) {
        var deferred = $q.defer();
        // 声明延后执行，表示要去监控后面的执行
        $http({
          method: 'DELETE',
          contentType: 'application/json',
          headers: { 'userId': '112' },
          url: _link
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
 * Created by xubt on 6/13/16.
 */
kanbanApp.directive('focus', [
  '$timeout',
  '$parse',
  function ($timeout, $parse) {
    return function (scope, element, attrs) {
      scope.$watch(attrs.focus, function (newValue) {
        $timeout(function () {
          newValue && element[0].focus();
        });
      }, true);
    };
  }
]);