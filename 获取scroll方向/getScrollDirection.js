/*
 * return boolean
 * true -> clockwise 顺时针
 * false -> anti-clockwise 逆时针
 */

(function (win) {
    var lastScrollTop = document.documentElement.scrollTop;
    function getScrollDirection() {
        var curScrollTop = document.documentElement.scrollTop;
        var flag;
        if (curScrollTop > lastScrollTop) {
            flag = false
        } else {
            flag = true
        }
        lastScrollTop = curScrollTop;
        return flag;
    }
    win.getScrollDirection = getScrollDirection;
})(window);