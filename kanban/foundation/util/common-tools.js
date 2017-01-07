/**
 * Created by xubt on 30/09/2016.
 */
String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};
function dataURItoBlob(dataURI) {
    var binary = atob(dataURI.split(',')[1]);
    var array = [];
    for (var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
}

kanbanApp.factory('jsonService', function () {
    return {
        findById: function (_jsonArray, _id) {
            for (var index in _jsonArray) {
                if (_jsonArray[index].id === _id) {
                    return _jsonArray[index];
                }
            }
            return {};
        }
    };
});
