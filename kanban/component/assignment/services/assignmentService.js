/* assignmentServices */

kanbanApp.factory('assignmentServices', ['$http', '$q', 'httpServices', function ($http, $q, httpServices) {
    return {
        assign: function (_assignment, _link) {
            return httpServices.post(_assignment, _link);
        },
        loadAssignments: function (_assignmentLink) {
            return httpServices.get(_assignmentLink);
        },
        giveUp: function (_link) {
            return httpServices.delete(_link);
        }
    };
}]);
