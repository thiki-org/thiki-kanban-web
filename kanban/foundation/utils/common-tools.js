/**
 * Created by xubt on 30/09/2016.
 */
kanbanApp.factory('jsonService', function () {
    return {
        findById: function (_jsonArray, _id) {
            for (var index in _jsonArray) {
                if (_jsonArray[index].id === _id) {
                    return _jsonArray[index];
                }
            }
            return {};
        },
        findByKey: function (_jsonArray, _key, _value) {
            for (var index in _jsonArray) {
                if (_jsonArray[index][_key] === _value) {
                    return _jsonArray[index];
                }
            }
            return {};
        },
        contains: function (_jsonArray, _key, _value) {
            for (var index in _jsonArray) {
                if (_jsonArray[index][_key] === _value) {
                    return true;
                }
            }
            return false;
        }
    };
});

kanbanApp.filter('range', function () {
    return function (input, total) {
        total = parseInt(total);
        for (var i = 0; i < total; i++) {
            input.push(i);
        }
        return input;
    };
});