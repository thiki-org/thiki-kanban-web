'use strict';
/* App Module */
var kanbanApp = angular.module('kanbanApp', [
    'ngRoute',
    'entriesControllers',
    'entriesServices',
    'ui.sortable'
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
  'Entries',
  function ($scope, Entries) {
    $scope.entries = Entries.load();
    console.log(Entries.load());
    console.log('EntriesCtrl....');
    console.log($('.entryTitle'));
    $('#username').editable();
    $scope.statusFilter = { status: 1 };
    $scope.createEntry = function () {
      var title = $scope.title;
      var entry = {
          id: 3333,
          title: title,
          status: 0
        };
      $scope.entries.push(entry);
    };
    $scope.sortableOptions = {
      placeholder: 'task',
      connectWith: '.tasks',
      opacity: 0.5,
      start: function (e, ui) {
        ui.item.attr('opacity', '0.5');  //alert(ui.item.sortable.model.id + ui.item.sortable.model.title);
      },
      update: function (e, ui) {
        ui.item.attr('opacity', '0.5');  //alert(ui.item.sortable.model.id + ui.item.sortable.model.title);
      },
      stop: function (e, ui) {
        ui.item.attr('opacity', '1.0');  //alert(ui.item.sortable.model.id + ui.item.sortable.model.title);
      }
    };
  }
]);
'use strict';
/* Services */
var entriesServices = angular.module('entriesServices', ['ngResource']);
entriesServices.factory('Entries', [
  '$resource',
  function ($resource) {
    console.log('\u6211\u662fServer');
    return $resource('entries/entries.json', {}, {
      load: {
        method: 'GET',
        isArray: true
      }
    });
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
        console.log(scope.$index);
        if (scope.$last == true) {
          console.log('ng-repeat\u6267\u884c\u5b8c\u6bd5');
          $timeout(function () {
            $('.entryTitle').editable();
            scope.$emit('ngRepeatFinished');
          });
        }
      }
    };
  }
]);