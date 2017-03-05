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
        },
        filterInSprintStages: function (_stagesArray) {
            var filtered = [];
            for (var index in _stagesArray) {
                if (_stagesArray[index].type !== 9 && _stagesArray[index].status === 0) {
                    filtered.push(_stagesArray[index]);
                }
            }
            return filtered;
        }
    };
}]);
