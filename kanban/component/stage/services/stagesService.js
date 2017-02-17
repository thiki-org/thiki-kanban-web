/* Services */

kanbanApp.factory('stagesServices', ['httpServices', function (httpServices) {
    return {
        stagesLink: '',
        load: function () {
            return httpServices.get(this.stagesLink);
        },
        create: function (_stage, _link) {
            return httpServices.post(_stage, _link);
        },
        update: function (_stage) {
            return httpServices.put(_stage, _stage._links.self.href);
        },
        deleteByLink: function (_link) {
            return httpServices.delete(_link);
        },
        resort: function (_stages, _resortLink) {
            return httpServices.put(_stages, _resortLink);
        }
    };
}]);
