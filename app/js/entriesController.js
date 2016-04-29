/**
 * Created by xubt on 4/20/16.
 */

var entriesControllers = angular.module('entriesControllers', []);


entriesControllers.controller('EntriesCtrl', ['$scope', 'Entries',
    function ($scope, Entries) {
        $scope.entries = Entries.load();
        console.log(Entries.load());
        console.log("EntriesCtrl....");
        console.log($('.entryTitle'));

        $('#username').editable();
        $scope.statusFilter = {status: 1};

        $scope.createEntry = function () {
            var title = $scope.title;
            var entry = {id: 3333, title: title, status: 0};
            $scope.entries.push(entry);
        }

        $scope.sortableOptions = {
            placeholder: "task",
            connectWith: ".tasks",
            opacity:0.5,
            start: function (e, ui) {
                ui.item.attr("opacity","0.5");
                //alert(ui.item.sortable.model.id + ui.item.sortable.model.title);
            },
            update: function (e, ui) {
                ui.item.attr("opacity","0.5");
                //alert(ui.item.sortable.model.id + ui.item.sortable.model.title);
            },
            stop: function (e, ui) {
                ui.item.attr("opacity","1.0");
                //alert(ui.item.sortable.model.id + ui.item.sortable.model.title);
            }
        };
    }]);
