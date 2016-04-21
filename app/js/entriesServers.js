'use strict';

/* Services */

var entriesServices = angular.module('entriesServices', ['ngResource']);

entriesServices.factory('Entries', ['$resource',
    function ($resource) {
        console.log("我是Server")
        return $resource('entries/entries.json', {}, {
            load: {method: 'GET', isArray: true}
        });
    }]);
