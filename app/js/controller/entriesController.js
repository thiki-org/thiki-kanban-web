/**
 * Created by xubt on 4/20/16.
 */

var entriesControllers = angular.module('entriesControllers', []);


entriesControllers.controller('EntriesCtrl', ['$scope', '$routeParams', '$q', 'Entries', 'Tasks',
    function ($scope, $routeParams, $q, Entries, Tasks) {
        function loadData() {
            var entries = [];
            var tasks = [];
            var entriesLink = $routeParams.entriesLink;
            Entries.entriesLink = entriesLink;
            var entriesPromise = Entries.load(entriesLink);
            entriesPromise.then(function (data) {
                    $scope.entries = data;

                    $scope.sortableOptions = {
                        connectWith: ".tasks",
                        opacity: 0.5,
                        start: function (e, ui) {
                            //   console.log("-----------" + $(ui.item.sortable.droptarget[0]).attr("entry"));
                            //alert(ui.item.sortable.model.id + ui.item.sortable.model.title);
                        },
                        update: function (e, ui) {
                            console.log(ui.item.scope());
                            var targetEntryId = JSON.parse($(ui.item.sortable.droptarget[0]).attr("entry")).id;
                            ui.item.sortable.model.entryId = targetEntryId;
                            ui.item.sortable.model.orderNumber = ui.item.sortable.dropindex;
                            console.log(ui.item.sortable.model);

                            var _tasksPromise = Tasks.update(ui.item.sortable.model);
                            _tasksPromise.then(function (data) {
                                loadData();
                            });
                        },
                        stop: function (e, ui) {

                        }
                    };
                }
            );
        }

        loadData();
    }])
;
