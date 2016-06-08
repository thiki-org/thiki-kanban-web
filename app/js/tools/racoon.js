/**
 * Created by xubitao on 1/2/16.
 */
var HttpType = {
    POST: "POST",
    PUT: "PUT",
    DELETE: "DELETE",
    GET: "GET"
};

var Racoon = {
    currentRequest: null,
    restful: function (_options) {
        var ok = function (_data) {
            _options.success(_data);

        };
        var created = function (_data) {
            _options.success(_data);

        };
        var error = function (_XHR, _TS) {
            $("#errorMessage").html(_XHR.responseJSON.message);
            $('#errorModel').modal();
        };

        var notFound = function (_XHR, _TS) {
            $("#errorMessage").html(_XHR.responseJSON.message);
            $('#errorModel').modal();

        };
        Racoon.currentRequest = $.ajax({
            type: _options.type || HttpType.GET,
            url: _options.url,
            dataType: _options.dataType || "json",
            async: _options.async || true,
            data: _options.data,
            contentType: "application/json",
            beforeSend: function () {
                if (_options.beforeSend != undefined) {
                    _options.beforeSend();
                }
                else {
                    $('#processing').show();
                }
            },
            statusCode: {
                200: ok,
                201: created,
                400: error,
                404: notFound,
                500: error
            },
            complete: function () {
                $('#processing').hide();
            }
        });
    },

    getLink: function (_links, _rel) {
        return _links[_rel].href;
    },
    isFirefoxBrowser: function () {
        var Sys = {};
        var ua = navigator.userAgent.toLowerCase();
        var re = /(msie|firefox|chrome|opera|version).*?([\d.]+)/;
        var m = ua.match(re);
        Sys.browser = m[1].replace(/version/, "'safari");
        Sys.ver = m[2];
        if (Sys.browser != "firefox") {
            window.location.href = "html/pleaseSwitchYourBrowser.html"
        }
    },
    JSONLength: function (obj) {
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) size++;
        }
        return size;
    },
    formatJson: function (json, options) {
        var reg = null,
            formatted = '',
            pad = 0,
            PADDING = '    '; // one can also use '\t' or a different number of spaces

        // optional settings
        options = options || {};
        // remove newline where '{' or '[' follows ':'
        options.newlineAfterColonIfBeforeBraceOrBracket = (options.newlineAfterColonIfBeforeBraceOrBracket === true) ? true : false;
        // use a space after a colon
        options.spaceAfterColon = (options.spaceAfterColon === false) ? false : true;
        try {
            // begin formatting...
            if (typeof json !== 'string') {
                // make sure we start with the JSON as a string
                json = JSON.stringify(json);
            } else {
                // is already a string, so parse and re-stringify in order to remove extra whitespace
                json = JSON.parse(json);
                json = JSON.stringify(json);
            }
        } catch (e) {
            return json;
        }
        // add newline before and after curly braces
        reg = /([\{\}])/g;
        json = json.replace(reg, '\r\n$1\r\n');

        // add newline before and after square brackets
        reg = /([\[\]])/g;
        json = json.replace(reg, '\r\n$1\r\n');

        // add newline after comma
        reg = /(\,)/g;
        json = json.replace(reg, '$1\r\n');

        // remove multiple newlines
        reg = /(\r\n\r\n)/g;
        json = json.replace(reg, '\r\n');

        // remove newlines before commas
        reg = /\r\n\,/g;
        json = json.replace(reg, ',');

        // optional formatting...
        if (!options.newlineAfterColonIfBeforeBraceOrBracket) {
            reg = /\:\r\n\{/g;
            json = json.replace(reg, ':{');
            reg = /\:\r\n\[/g;
            json = json.replace(reg, ':[');
        }
        if (options.spaceAfterColon) {
            reg = /\:/g;
            json = json.replace(reg, ': ');
        }

        $.each(json.split('\r\n'), function (index, node) {
            var i = 0,
                indent = 0,
                padding = '';

            if (node.match(/\{$/) || node.match(/\[$/)) {
                indent = 1;
            } else if (node.match(/\}/) || node.match(/\]/)) {
                if (pad !== 0) {
                    pad -= 1;
                }
            } else {
                indent = 0;
            }

            for (i = 0; i < pad; i++) {
                padding += PADDING;
            }

            formatted += padding + node + '\r\n';
            pad += indent;
        });

        return formatted;
    }
};
