'use strict';
/* App Module */
var config = { localhost: 'http://localhost:8080' };
var kanbanApp = angular.module('kanbanApp', [
    'ngRoute',
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
      templateUrl: 'partials/boards.html',
      controller: 'EntriesCtrl'
    }).when('/boards/:boardId/entries', { templateUrl: 'partials/entries.html' }).when('/boards', {
      templateUrl: 'partials/boards.html',
      controller: 'boardController'
    }).otherwise({
      templateUrl: 'partials/boards.html',
      controller: 'boardController'
    });
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
      templateUrl: 'partials/board-banner.html',
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
      templateUrl: 'partials/entry-creation.html',
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
          $scope.cancelCreateEntry = function () {
            $('#create-new-entry-form').hide();
            $('#create-new-entry-button').show();
          };
          $scope.showCreateEntryForm = function () {
            $('#create-new-entry-button').hide();
            $('#create-new-entry-form').show();
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
kanbanApp.directive('entries', [
  '$timeout',
  function ($timeout) {
    return {
      restrict: 'E',
      templateUrl: 'partials/entry.html',
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
/**
 * Created by xubt on 5/26/16.
 */
kanbanApp.directive('tasks', [
  '$timeout',
  function ($timeout) {
    return {
      restrict: 'E',
      templateUrl: 'partials/tasks.html',
      replace: true,
      controller: [
        '$scope',
        'tasksServices',
        function ($scope, tasksServices) {
          var entry = $scope.entry;
          var _tasksPromise = tasksServices.loadTasksByEntryId(entry._links.tasks.href);
          _tasksPromise.then(function (data) {
            $scope.tasks = data;
          });
        }
      ]
    };
  }
]);
kanbanApp.directive('taskCreation', [
  '$timeout',
  function ($timeout) {
    return {
      restrict: 'E',
      templateUrl: 'partials/task-creation.html',
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
    boardPromise.then(function (data) {
      $scope.boards = data;
    });
    $scope.toEntries = function (_boardId, _boardLink) {
      $location.path('/boards/' + _boardId + '/entries').search({ boardLink: _boardLink });
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
      }
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
        console.log('=========' + this.entriesLink);
        var deferred = $q.defer();
        // 声明延后执行，表示要去监控后面的执行
        // return a Promise object so that the caller can handle success/failure
        $http({
          method: 'GET',
          dataType: 'application/json',
          url: this.entriesLink
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
      }
    };
  }
]);
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
/**
 * Created by xubitao on 1/2/16.
 */
var HttpType = {
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE',
    GET: 'GET'
  };
var Racoon = {
    currentRequest: null,
    restful: function (_options) {
      var ok = function (_data) {
        _options.success(_data);
      };
      var created = function (_data) {
        _options.success(_data);
      };
      var error = function (_XHR, _TS) {
        $('#errorMessage').html(_XHR.responseJSON.message);
        $('#errorModel').modal();
      };
      var notFound = function (_XHR, _TS) {
        $('#errorMessage').html(_XHR.responseJSON.message);
        $('#errorModel').modal();
      };
      Racoon.currentRequest = $.ajax({
        type: _options.type || HttpType.GET,
        url: _options.url,
        dataType: _options.dataType || 'json',
        async: _options.async || true,
        data: _options.data,
        contentType: 'application/json',
        beforeSend: function () {
          if (_options.beforeSend != undefined) {
            _options.beforeSend();
          } else {
            $('#processing').show();
          }
        },
        statusCode: {
          200: ok,
          201: created,
          400: error,
          404: notFound,
          500: error
        },
        complete: function () {
          $('#processing').hide();
        }
      });
    },
    getLink: function (_links, _rel) {
      return _links[_rel].href;
    },
    isFirefoxBrowser: function () {
      var Sys = {};
      var ua = navigator.userAgent.toLowerCase();
      var re = /(msie|firefox|chrome|opera|version).*?([\d.]+)/;
      var m = ua.match(re);
      Sys.browser = m[1].replace(/version/, '\'safari');
      Sys.ver = m[2];
      if (Sys.browser != 'firefox') {
        window.location.href = 'html/pleaseSwitchYourBrowser.html';
      }
    },
    JSONLength: function (obj) {
      var size = 0, key;
      for (key in obj) {
        if (obj.hasOwnProperty(key))
          size++;
      }
      return size;
    },
    formatJson: function (json, options) {
      var reg = null, formatted = '', pad = 0, PADDING = '    ';
      // one can also use '\t' or a different number of spaces
      // optional settings
      options = options || {};
      // remove newline where '{' or '[' follows ':'
      options.newlineAfterColonIfBeforeBraceOrBracket = options.newlineAfterColonIfBeforeBraceOrBracket === true ? true : false;
      // use a space after a colon
      options.spaceAfterColon = options.spaceAfterColon === false ? false : true;
      try {
        // begin formatting...
        if (typeof json !== 'string') {
          // make sure we start with the JSON as a string
          json = JSON.stringify(json);
        } else {
          // is already a string, so parse and re-stringify in order to remove extra whitespace
          json = JSON.parse(json);
          json = JSON.stringify(json);
        }
      } catch (e) {
        return json;
      }
      // add newline before and after curly braces
      reg = /([\{\}])/g;
      json = json.replace(reg, '\r\n$1\r\n');
      // add newline before and after square brackets
      reg = /([\[\]])/g;
      json = json.replace(reg, '\r\n$1\r\n');
      // add newline after comma
      reg = /(\,)/g;
      json = json.replace(reg, '$1\r\n');
      // remove multiple newlines
      reg = /(\r\n\r\n)/g;
      json = json.replace(reg, '\r\n');
      // remove newlines before commas
      reg = /\r\n\,/g;
      json = json.replace(reg, ',');
      // optional formatting...
      if (!options.newlineAfterColonIfBeforeBraceOrBracket) {
        reg = /\:\r\n\{/g;
        json = json.replace(reg, ':{');
        reg = /\:\r\n\[/g;
        json = json.replace(reg, ':[');
      }
      if (options.spaceAfterColon) {
        reg = /\:/g;
        json = json.replace(reg, ': ');
      }
      $.each(json.split('\r\n'), function (index, node) {
        var i = 0, indent = 0, padding = '';
        if (node.match(/\{$/) || node.match(/\[$/)) {
          indent = 1;
        } else if (node.match(/\}/) || node.match(/\]/)) {
          if (pad !== 0) {
            pad -= 1;
          }
        } else {
          indent = 0;
        }
        for (i = 0; i < pad; i++) {
          padding += PADDING;
        }
        formatted += padding + node + '\r\n';
        pad += indent;
      });
      return formatted;
    }
  };