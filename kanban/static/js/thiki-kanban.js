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
    'boardsService',
    'xeditable',
    'LocalStorageModule'
  ]);
kanbanApp.config([
  '$routeProvider',
  '$httpProvider',
  'localStorageServiceProvider',
  function ($routeProvider, $httpProvider, localStorageServiceProvider) {
    localStorageServiceProvider.setPrefix('thiki.kanban').setStorageType('sessionStorage');
    $httpProvider.interceptors.push('myHttpResponseInterceptor');
    $routeProvider.when('/boards/:boardId/entries', { templateUrl: 'component/entry/partials/entry-partial.html' }).when('/boards', {
      templateUrl: 'component/board/partials/boards.html',
      controller: 'boardController'
    }).otherwise({
      templateUrl: 'component/board/partials/boards.html',
      controller: 'boardController'
    });
  }
]);
kanbanApp.run([
  'editableOptions',
  function (editableOptions) {
    editableOptions.theme = 'bs3';
  }
]);
kanbanApp.factory('myHttpResponseInterceptor', [
  '$q',
  '$location',
  function ($q, $location) {
    return {
      'request': function (config) {
        // do something on success
        return config;
      },
      'requestError': function (rejection) {
        // do something on error
        if (canRecover(rejection)) {
          return responseOrNewPromise;
        }
        return $q.reject(rejection);
      },
      'response': function (response) {
        // do something on success
        return response;
      },
      'responseError': function (rejection) {
        console.log(rejection);
        alert('\u8bf7\u6c42\u51fa\u9519');
        // do something on error
        if (canRecover(rejection)) {
          return responseOrNewPromise;
        }
        return $q.reject(rejection);
      }
    };
  }
]);
/* assignmentServices */
kanbanApp.factory('assignmentServices', [
  '$http',
  '$q',
  function ($http, $q) {
    return {
      assign: function (_assignment, _link) {
        var deferred = $q.defer();
        // 声明延后执行，表示要去监控后面的执行
        $http({
          method: 'POST',
          contentType: 'application/json',
          data: JSON.stringify(_assignment),
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
 * Created by xubt on 4/20/16.
 */
var boardController = angular.module('boardController', []);
var boardsLink = 'http://localhost:8080/boards';
boardController.controller('boardController', [
  '$scope',
  '$location',
  '$q',
  'boardsService',
  'localStorageService',
  function ($scope, $location, $q, boardsService, localStorageService) {
    var boardPromise = boardsService.load(boardsLink);
    boardsService.boardsLink = boardsLink;
    boardPromise.then(function (data) {
      $scope.boards = data;
    });
    $scope.toEntries = function (_boardId, _boardLink) {
      localStorageService.set('boardLink', _boardLink);
      $location.path('/boards/' + _boardId + '/entries');
    };
    $scope.displayBoardCreationForm = true;
    $scope.displayForm = false;
    $scope.createBoard = function () {
      var name = $scope.board.name;
      var board = { name: name };
      var entriesPromise = boardsService.create(board);
      entriesPromise.then(function (data) {
        if ($scope.boards === null) {
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
kanbanApp.directive('boardBanner', function () {
  return {
    restrict: 'E',
    templateUrl: 'component/board/partials/board-banner.html',
    replace: false,
    controller: [
      '$scope',
      '$location',
      'boardsService',
      'localStorageService',
      function ($scope, $location, boardsService, localStorageService) {
        var boardLink = localStorageService.get('boardLink');
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
});
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
 * Created by xubt on 5/26/16.
 */
kanbanApp.directive('taskCreation', [
  '$timeout',
  function ($timeout) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'component/task/partials/task-creation.html',
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
          $scope.blur = function () {
            if ($scope.summary === '') {
              $scope.displayCreationButton = true;
              $scope.displayForm = false;
            }
          };
        }
      ]
    };
  }
]);
/**
 * Created by xubt on 6/17/16.
 */
kanbanApp.directive('task', [
  '$uibModal',
  function ($uibModal) {
    return {
      restrict: 'E',
      templateUrl: 'component/task/partials/task.html',
      replace: true,
      transclude: true,
      scope: { task: '=' },
      controller: [
        '$scope',
        'localStorageService',
        'assignmentServices',
        'tasksServices',
        function ($scope, localStorageService, assignmentServices, tasksServices) {
          $scope.assign = function (_task) {
            localStorageService.set('userId', '341182');
            $uibModal.open({
              animation: false,
              templateUrl: 'component/task/partials/assignment-confirm.html',
              controller: [
                '$scope',
                '$uibModalInstance',
                function ($scope, $uibModalInstance) {
                  $scope.title = '\u786e\u8ba4\u4fe1\u606f';
                  $scope.message = '\u4f60\u786e\u5b9a\u8981\u8ba4\u9886\u8be5\u4efb\u52a1\u5417?';
                  $scope.ok = function () {
                    var assignment = {
                        taskId: _task.id,
                        assignee: localStorageService.get('userId'),
                        assigner: localStorageService.get('userId')
                      };
                    var assignmentPromise = assignmentServices.assign(assignment, _task._links.assignments.href);
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
          $scope.updateTask = function (_summary, _task) {
            var task = _task;
            task.summary = _summary;
            var taskPromise = tasksServices.update(task);
            taskPromise.then(function () {
            });
          };
          $scope.openDeleteModal = function (_message, _link) {
            var currentScope = $scope;
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
                      currentScope.$parent.loadTasks();
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
      ]
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
      templateUrl: 'component/task/partials/tasks.html',
      replace: true,
      controller: [
        '$scope',
        '$routeParams',
        'tasksServices',
        'localStorageService',
        'assignmentServices',
        function ($scope, $routeParams, tasksServices, localStorageService, assignmentServices) {
          $scope.loadTasks = function () {
            var entry = $scope.entry;
            var _tasksPromise = tasksServices.loadTasksByEntryId(entry._links.tasks.href);
            _tasksPromise.then(function (data) {
              $scope.tasks = data;
              $scope.sortableOptions = {
                connectWith: '.tasks',
                opacity: 0.5,
                placeholder: 'task-drag-placeholder',
                start: function (e, ui) {
                  console.log('staring sort.');
                },
                update: function (e, ui) {
                  console.log('updating sort.');
                },
                stop: function (e, ui) {
                  console.log('stopping sort.');
                  if (ui.item.sortable.droptarget === undefined) {
                    return;
                  }
                  var targetEntryId = $(ui.item.sortable.droptarget[0]).parent().attr('entryId');
                  if (targetEntryId == ui.item.sortable.model.entryId) {
                    return;
                  }
                  ui.item.sortable.model.entryId = targetEntryId;
                  ui.item.sortable.model.orderNumber = ui.item.sortable.dropindex;
                  var _tasksPromise = tasksServices.update(ui.item.sortable.model);
                  _tasksPromise.then(function (data) {
                  });
                }
              };
            });
          };
          $scope.loadTasks();
        }
      ]
    };
  }
]);
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
 * Created by xubt on 4/29/16.
 */
kanbanApp.directive('entries', function () {
  return {
    restrict: 'E',
    templateUrl: 'component/entry/partials/entries.html',
    replace: true,
    scope: true,
    controller: [
      '$scope',
      'boardsService',
      'entriesServices',
      'localStorageService',
      function ($scope, boardsService, entriesServices, localStorageService) {
        $scope.loadEntries = function () {
          var boardLink = localStorageService.get('boardLink');
          var boardPromise = boardsService.loadBoardByLink(boardLink);
          boardPromise.then(function (_board) {
            $scope.board = _board;
            entriesServices.entriesLink = _board._links.entries.href;
            var entriesPromise = entriesServices.load(_board._links.entries.href);
            entriesPromise.then(function (data) {
              $scope.entries = data;
            });
          });
        };
        $scope.loadEntries();
      }
    ]
  };
});
/* Services */
angular.module('entriesServices', ['ngResource']).factory('entriesServices', [
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
          headers: {'userId': '112'},
          url: this.entriesLink
        }).success(function (data, status, headers, config) {
          deferred.resolve(data);  // 声明执行成功，即http请求数据成功，可以返回数据了
        }).error(function (data, status, headers, config) {
          deferred.reject(data);  // 声明执行失败，即服务器返回错误
        });
        return deferred.promise;  // 返回承诺，这里并不是最终数据，而是访问最终数据的API
      },
      update: function (_entry) {
        var deferred = $q.defer();
        // 声明延后执行，表示要去监控后面的执行
        // return a Promise object so that the caller can handle success/failure
        $http({
          method: 'PUT',
          contentType: 'application/json',
          data: JSON.stringify(_entry),
          headers: {'userId': '112'},
          url: _entry._links.self.href
        }).success(function (data, status, headers, config) {
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
          headers: {'userId': '112'},
          url: _link
        }).success(function (data, status, headers, config) {
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
kanbanApp.directive('entryCreation', function () {
  return {
    restrict: 'E',
    templateUrl: 'component/entry/partials/entry-creation.html',
    replace: true,
    scope: true,
    controller: [
      '$scope',
      'entriesServices',
      function ($scope, entriesServices) {
        $scope.createEntry = function () {
          var title = $scope.title;
          var entry = {
            title: title,
            boardId: $scope.board.id
          };
          var entriesPromise = entriesServices.create(entry);
          entriesPromise.then(function (data) {
            if ($scope.entries === null) {
              $scope.entries = [];
            }
            $scope.entries.push(data);
            $scope.title = '';
            $scope.cancelCreateEntry();
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
        $scope.blur = function () {
          if ($scope.title === '' || $scope.title === undefined) {
            $scope.cancelCreateEntry();
          }
        };
        $scope.updateEntry = function (_title, _entry) {
          var entry = _entry;
          entry.title = _title;
          var entryPromise = entriesServices.update(entry);
          entryPromise.then(function () {
          });
        };
      }
    ]
  };
});
/**
 * Created by xubt on 4/29/16.
 */
kanbanApp.directive('entry', [
  '$uibModal',
  function ($uibModal) {
    return {
      restrict: 'E',
      templateUrl: 'component/entry/partials/entry.html',
      replace: true,
      transclude: true,
      scope: {entry: '='},
      controller: [
        '$scope',
        'boardsService',
        'entriesServices',
        function ($scope, boardsService, entriesServices) {
          $scope.displayEntryMenu = false;
          $scope.onEntryMenuMouseOver = function () {
            $scope.displayEntryMenu = true;
          };
          $scope.onEntryMenuMouseLeave = function () {
            $scope.displayEntryMenu = false;
          };
          var currentScope = $scope;
          $scope.openModal = function (_message, _link) {
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
                    var _entryDeletePromise = entriesServices.deleteByLink(_link);
                    _entryDeletePromise.then(function () {
                      currentScope.$parent.loadEntries();
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
      ]
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
          if (newValue)
            element[0].focus();
        });
      }, true);
    };
  }
]);
angular.module('xeditable').factory('editableThemes', function () {
  var themes = {
      'default': {
        formTpl: '<form class="editable-wrap"></form>',
        noformTpl: '<span class="editable-wrap"></span>',
        controlsTpl: '<span class="editable-controls"></span>',
        inputTpl: '',
        errorTpl: '<div class="editable-error" ng-show="$error" ng-bind="$error"></div>',
        buttonsTpl: '<span class="editable-buttons"></span>',
        submitTpl: '<button type="submit">save</button>',
        cancelTpl: '<button type="button" ng-click="$form.$cancel()">cancel</button>'
      },
      'bs2': {
        formTpl: '<form class="form-inline editable-wrap" role="form"></form>',
        noformTpl: '<span class="editable-wrap"></span>',
        controlsTpl: '<div class="editable-controls controls control-group" ng-class="{\'error\': $error}"></div>',
        inputTpl: '',
        errorTpl: '<div class="editable-error help-block" ng-show="$error" ng-bind="$error"></div>',
        buttonsTpl: '<span class="editable-buttons"></span>',
        submitTpl: '<button type="submit" class="btn btn-primary">\u597d\u7684</button>',
        cancelTpl: '<button type="button" class="btn" ng-click="$form.$cancel()">' + '<span></span>' + '</button>'
      },
      'bs3': {
        formTpl: '<form class="form-inline editable-wrap" role="form"></form>',
        noformTpl: '<span class="editable-wrap"></span>',
        controlsTpl: '<div class="editable-controls form-group" ng-class="{\'has-error\': $error}"></div>',
        inputTpl: '',
        errorTpl: '<div class="editable-error help-block" ng-show="$error" ng-bind="$error"></div>',
        buttonsTpl: '<span class="editable-buttons"></span>',
        submitTpl: '<button type="submit" class="btn btn-primary">\u597d</button>',
        cancelTpl: '<button type="button" class="btn  editable-cancel-button" ng-click="$form.$cancel()">' + '\u653e\u5f03' + '</button>',
        buttonsClass: '',
        inputClass: '',
        postrender: function () {
          //apply `form-control` class to std inputs
          switch (this.directiveName) {
          case 'editableText':
          case 'editableSelect':
          case 'editableTextarea':
          case 'editableEmail':
          case 'editableTel':
          case 'editableNumber':
          case 'editableUrl':
          case 'editableSearch':
          case 'editableDate':
          case 'editableDatetime':
          case 'editableBsdate':
          case 'editableTime':
          case 'editableMonth':
          case 'editableWeek':
          case 'editablePassword':
            this.inputEl.addClass('form-control');
            if (this.theme.inputClass) {
              // don`t apply `input-sm` and `input-lg` to select multiple
              // should be fixed in bs itself!
              if (this.inputEl.attr('multiple') && (this.theme.inputClass === 'input-sm' || this.theme.inputClass === 'input-lg')) {
                break;
              }
              this.inputEl.addClass(this.theme.inputClass);
            }
            break;
          case 'editableCheckbox':
            this.editorEl.addClass('checkbox');
          }
          //apply buttonsClass (bs3 specific!)
          if (this.buttonsEl && this.theme.buttonsClass) {
            this.buttonsEl.find('button').addClass(this.theme.buttonsClass);
          }
        }
      },
      'semantic': {
        formTpl: '<form class="editable-wrap ui form" ng-class="{\'error\': $error}" role="form"></form>',
        noformTpl: '<span class="editable-wrap"></span>',
        controlsTpl: '<div class="editable-controls ui fluid input" ng-class="{\'error\': $error}"></div>',
        inputTpl: '',
        errorTpl: '<div class="editable-error ui error message" ng-show="$error" ng-bind="$error"></div>',
        buttonsTpl: '<span class="mini ui buttons"></span>',
        submitTpl: '<button type="submit" class="ui primary button">\u597d\u7684</button>',
        cancelTpl: '<button type="button" class="ui button" ng-click="$form.$cancel()">' + '<i class="ui cancel icon"></i>' + '</button>'
      }
    };
  return themes;
});
/**
 * Created by xubt on 5/26/16.
 */
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
