/**
 *
 * @param {HTMLElement | Window | String} el 监听的目标
 * @param {Function} callback 触底时的回调函数
 */
function onReachBottom(el, callback) {
    const isWindow = el === window;
    if (typeof el === 'string') el = document.querySelector(el)
    // CSS1Compat为标准模式
    const isStandard = document.compatMode === 'CSS1Compat';
    const scrollElement = isWindow ? (isStandard ? document.documentElement : document.body) : el;
    el.addEventListener('scroll', function (e) {
        const cHeight = scrollElement.clientHeight;
        const sHeight = scrollElement.scrollHeight;
        // 跨浏览器兼容
        let sTop = isWindow ? window.scrollY : scrollElement.scrollTop;
        // 注意：在使用显示比例缩放的系统上，scrollTop可能会提供一个小数。
        sTop = Math.ceil(sTop) // 向上取整
        if (sTop + cHeight >= sHeight) callback && callback()
    })
}
