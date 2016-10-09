/**
 * Created by xubt on 10/9/16.
 */

kanbanApp.factory('profileService', ['$http', '$q', 'localStorageService', 'httpServices',
    function ($http, $q, localStorageService, httpServices) {
        return {
            updateProfile: function (_profile, _profileLink) {
                return httpServices.put(_profile, _profileLink);
            }
        };
    }]);
