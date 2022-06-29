;
/**
 * @param {Object} options
 * @param {String} [options.lazyLoadClass]  要监听懒加载的类名，默认为 lazyload
 * @param {Function} [options.onLoadCallback] 当被监听的元素进入可视窗口时触发
 */
function lazyLoad(options) {
    var onLoadCallback = options.onLoadCallback
    if (!onLoadCallback) return
    if (typeof onLoadCallback !== 'function') throw Error('Callback must be a function')
    var lazyLoadClass = options.lazyLoadClass || 'lazyload'
    var lazyLoadList = document.getElementsByClassName(lazyLoadClass) // 因为getElementsByClassName返回的是一个实时的集合
    lazyLoad()
    window.addEventListener('scroll', lazyLoad)

    function lazyLoad() {
        for (var i = 0; i < lazyLoadList.length; i++) {
            var elem = lazyLoadList[i]
            var elemRectInfo = elem.getBoundingClientRect()
            // 如果没有设置正确的文档类型，则document.documentElement.clientHeight会返回意料之外的结果
            var clientHeight = window.innerHeight || (document.compatMode === 'CSS1Compat' ? document.documentElement.clientHeight : document.body.clientHeight)
            var top = elemRectInfo.top
            if (top < clientHeight) {
                // 由于 getElementsByClassName 返回的是实时数组。因此从数组里剔除掉当前类样式，lazyLoadList 会自动变化
                elem.classList.remove(lazyLoadClass)
                onLoadCallback && onLoadCallback.call(elem, elem)
                // 因为从数组里移除了一个元素，上一个元素才是本轮应该遍历的元素
                i--
            }
        }
    }
}
