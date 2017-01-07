/* Services */

kanbanApp.factory('proceduresServices', ['httpServices',
    function (httpServices) {
        return {
            proceduresLink: '',
            load: function () {
                return httpServices.get(this.proceduresLink);
            },
            create: function (_procedure) {
                return httpServices.post(_procedure, this.proceduresLink);
            },
            update: function (_procedure) {
                return httpServices.put(_procedure, _procedure._links.self.href);
            },
            deleteByLink: function (_link) {
                return httpServices.delete(_link);
            },
            resort: function (_procedures, _resortLink) {
                return httpServices.put(_procedures, _resortLink);
            }
        };
    }]);
