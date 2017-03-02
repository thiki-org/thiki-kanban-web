kanbanApp.isCacheUrl = function(_url) {
    if (_url === undefined || _url === "" || _url === null) {
        return false;
    }
    for (var index in kanbanApp.cacheUrls) {
        if (_url.lastIndexOf(kanbanApp.cacheUrls[index]) > -1) {
            return true;
        }
    }
    return false;
};