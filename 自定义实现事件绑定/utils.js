(function (win) {
    var utils = {};
    function on (ele, event, fn) {
        if (typeof ele !== 'object') ele = $(ele);
        if (!ele[event + 'queue']) ele[event + 'queue'] = [];
        ele[event + 'queue'].push(fn);
        ele['on' + event] = function (e) {
            ele[event + 'queue'].forEach(fn => {
                fn.call(ele, e);
            });
        }
    }
    function off (ele, event, fn) {
        if (typeof ele !== 'object') ele = $(ele);
        if (!ele[event + 'queue'] || !ele[event + 'queue'].length) return;
        var reservedEvents = [];
        ele[event + 'queue'].forEach((_fn, index) => {
            if (fn !== _fn) reservedEvents.push(_fn);
        });
        ele[event + 'queue'] = reservedEvents
    }
    function trigger (ele, event) {
        if (typeof ele !== 'object') ele = $(ele);
        ele['on' + event]();
    }
    function $ (ele) {
        return document.querySelector(ele);
    }
    utils.on = on;
    utils.off = off;
    utils.trigger = trigger;
    utils.$ = $;
    win.utils = utils;
})(this);