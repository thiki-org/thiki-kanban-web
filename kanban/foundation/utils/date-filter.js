/**
 * Created by xubt on 08/02/2017.
 */

kanbanApp.filter("formatTime", function () {
    return function (_time, _dateStyle) {
        if (_dateStyle === undefined) {
            _dateStyle = "YYYY-MM-DD";
        }
        return moment(_time).format(_dateStyle);
    };
});