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
        },
        indexOf: function (_jsonArray, _key, _value) {
            for (var index in _jsonArray) {
                if (_jsonArray[index][_key] === _value) {
                    return index;
                }
            }
            return -1;
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

kanbanApp.directive('changeOnBlur', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, elm, attrs, ngModelCtrl) {
            if (attrs.type === 'radio' || attrs.type === 'checkbox')
                return;

            var expressionToCall = attrs.changeOnBlur;

            var oldValue = null;
            elm.bind('focus', function () {
                scope.$apply(function () {
                    oldValue = elm.val();
                    console.log(oldValue);
                });
            });
            elm.bind('blur', function () {
                scope.$apply(function () {
                    var newValue = elm.val();
                    console.log(newValue);
                    if (newValue !== oldValue) {
                        scope.$eval(expressionToCall);
                    }
                    //alert('changed ' + oldValue);
                });
            });
        }
    };
});

kanbanApp.directive('fallbackSrc', function () {
    var fallbackSrc = {
        link: function postLink(scope, iElement, iAttrs) {
            var loadElement = angular.element(document.createElement('img'));

            loadElement.bind('error', function () {
                scope.$apply(function () {
                    scope.imageFailed(loadElement.attr('src'));
                });
            });

            loadElement.bind('load', function () {
                element.attr('src', loadElement.attr('src'));
            });
        }
    };
    return fallbackSrc;
});
kanbanApp.directive('characterCount', function () {
    return {
        restrict: 'A',
        compile: function compile() {
            return {
                post: function postLink(scope, iElement, iAttrs) {
                    iElement.bind('keydown', function () {
                        scope.$apply(function () {
                            scope.numberOfCharacters = iElement.val().length;
                        });
                    });
                }
            }
        }
    }
});

kanbanApp.directive('postRepeatDirective',
    ['$timeout',
        function ($timeout) {
            return function (scope) {
                if (scope.$first)
                    window.a = new Date();   // window.a can be updated anywhere if to reset counter at some action if ng-repeat is not getting started from $first
                if (scope.$last)
                    $timeout(function () {
                        console.log("## DOM rendering list took: " + (new Date() - window.a) + " ms");
                    });
            };
        }
    ]);
kanbanApp.filter('startFrom', function () {
    return function (input, start) {
        return input.slice(start);
    };
});

function arrayBufferToString(buf) {
    return String.fromCharCode.apply(null, new Uint16Array(buf));
}

function stringToArrayBuffer(str) {
    var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
    var bufView = new Uint16Array(buf);
    for (var i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}