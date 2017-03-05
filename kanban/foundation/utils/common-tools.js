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