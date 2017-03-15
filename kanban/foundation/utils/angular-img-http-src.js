/**
 * Created by xubt on 26/02/2017.
 */
kanbanApp.directive('httpSrc', ['$http', 'localStorageService', function ($http, localStorageService) {
    return {
        // do not share scope with sibling img tags and parent
        // (prevent show same images on img tag)
        scope: {},
        link: function ($scope, elem, attrs) {
            function revokeObjectURL() {
                if ($scope.objectURL) {
                    URL.revokeObjectURL($scope.objectURL);
                }
            }

            $scope.$watch('objectURL', function (objectURL) {
                elem.attr('src', objectURL);
            });

            $scope.$on('$destroy', function () {
                revokeObjectURL();
            });

            attrs.$observe('httpSrc', function (url) {
                revokeObjectURL();
                if (url === undefined || url === null || url === "") {
                    return;
                }
                if (url && url.indexOf('data:') === 0) {
                    $scope.objectURL = url;
                } else if (url) {
                    if (kanbanApp.isCacheUrl(url)) {
                        var cachedImageResponseDataString = localStorageService.get(url);
                        if (localStorageService.get(url) !== null) {
                            console.log("Load image file from local cache:" + url);
                            var bufferString = stringToArrayBuffer(cachedImageResponseDataString);
                            var blob = new Blob(
                                [bufferString],
                                {type: "image/*"}
                            );
                            $scope.objectURL = URL.createObjectURL(blob);
                            return;
                        }
                    }
                    $http.get(url, {
                        responseType: 'arraybuffer',
                        headers: {
                            'accept': 'image/webp,image/*,*/*;q=0.8'
                        }
                    }).then(function (response) {
                        var blob = new Blob(
                            [response.data],
                            {type: "image/*"}
                        );
                        $scope.objectURL = URL.createObjectURL(blob);
                        localStorageService.set(url, arrayBufferToString(response.data));
                    });
                }
            });
        }
    };
}]);