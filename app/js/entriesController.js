/**
 * Created by xubt on 4/20/16.
 */

var entriesControllers = angular.module('entriesControllers', []);


entriesControllers.controller('EntriesCtrl', ['$scope', 'Entries',
    function ($scope, Entries) {
        $scope.entries = Entries.load();
        console.log(Entries.load());
        console.log("EntriesCtrl....");

        $scope.statusFilter = {status: 1};


        $scope.createEntry = function () {
            var title = $scope.title;
            var entry = {id: 3333, title: title, status: 0};
            $scope.entries.push(entry);
        }

        $scope.sortableOptions = {
            placeholder: "task",
            connectWith: ".tasks"
        };

        $scope.loaded = function (taskId) {
        }
    }]);
