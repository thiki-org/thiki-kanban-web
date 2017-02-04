/**
 * Created by xubt on 9/24/16.
 */
kanbanApp.factory('invitationService', ['$http', '$q', 'httpServices',
    function ($http, $q, httpServices) {
        return {
            loadInvitationByLink: function (_invitationLink) {
                return httpServices.get(_invitationLink);
            },
            acceptInvitation: function (_invitationLink) {
                return httpServices.putWithNoBody(_invitationLink);
            }
        };
    }]);
