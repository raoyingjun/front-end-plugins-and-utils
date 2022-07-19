/**
 * @description 滚动边距监听器，可监听触达各个方向事件，参数请参阅配置项。
 * @param {HTMLElement | string} el - 监听的目标，请勿直接监听 window。
 * @param {Object} options - 滚动监听配置项
 * @param {Function} [options.onReachTop] - 到达顶端时触发该回调函数。
 * @param {Function} [options.onReachRight] - 到达最右边时触发该回调函数。
 * @param {Function} [options.onReachBottom] - 到达底部时触发该回调函数。
 * @param {Function} [options.onReachLeft] - 到达最左边时触发该回调函数。
 * @param {number} [options.offset=0] - 当距离各边距的位置满足偏移时触发事件
 * @param {number} [options.offsetTop=options.offset] - 距离顶端的位置满足偏移时触发事件，不进行设置则回退使用 offset 的值
 * @param {number} [options.offsetRight=options.offset] - 距离最右边的位置满足偏移时触发事件，不进行设置则回退使用 offset 的值
 * @param {number} [options.offsetBottom=options.offset] - 距离底部的位置满足偏移时触发事件，不进行设置则回退使用 offset 的值
 * @param {number} [options.offsetLeft=options.offset] - 距离最左边的位置满足偏移时触发事件，不进行设置则回退使用 offset 的值
 */
function scrollEdgeWatcher(el, options) {
    if (typeof el === 'string') el = document.querySelector(el)
    const {
        offsetTop,
        offsetRight,
        offsetBottom,
        offsetLeft,
        onReachTop,
        onReachRight,
        onReachBottom,
        onReachLeft,
    } = initParams(options)
    el.addEventListener('scroll', handleScroll)

    function handleScroll() {
        const {
            isReachTop,
            isReachRight,
            isReachBottom,
            isReachLeft,
        } = getParams(el)
        isReachBottom && onReachBottom()
        isReachTop && onReachTop()
        isReachRight && onReachRight()
        isReachLeft && onReachLeft()

    }

    /**
     * @description 初始化参数，将缺省配置项标准化
     * @param {Object} options 配置项
     * @return {Object} opts 标准化后的配置项
     */
    function initParams(options) {
        const opts = {}
        opts.offset = options.offset ?? 0;
        opts.offsetTop = options.offsetTop ?? opts.offset;
        opts.offsetRight = options.offsetRight ?? opts.offset;
        opts.offsetBottom = options.offsetBottom ?? opts.offset;
        opts.offsetLeft = options.offsetLeft ?? opts.offset;
        opts.onReachTop = options.onReachTop ?? noop
        opts.onReachRight = options.onReachRight ?? noop
        opts.onReachBottom = options.onReachBottom ?? noop
        opts.onReachLeft = options.onReachLeft ?? noop
        return opts
    }

    // 注意：在使用显示比例缩放的系统上，scrollTop、scrollLeft 可能会提供一个小数，故向上取整
    // 首轮求取 scrollTop
    let sTop = Math.ceil(el.scrollTop)
    // 首轮求取 scrollLeft
    let sLeft = Math.ceil(el.scrollLeft)
    const {
        top,
        right,
        bottom,
        left
    } = getUsableOffset()
    // 首轮判断是否触顶
    let isReachTop = sTop <= top
    // 首轮判断是否到达最右侧
    let isReachRight = sLeft + el.clientWidth >= el.scrollWidth - right
    // 首轮判断是否触底.
    let isReachBottom = sTop + el.clientHeight >= el.scrollHeight - bottom
    // 首轮判断是否到达最左侧
    let isReachLeft = sLeft <= left

    /**
     *
     * @param {HTMLElement} el
     * @return {{isReachTop: boolean, isReachRight: boolean, isReachBottom: boolean, isReachLeft: boolean}}
     */
    function getParams(el) {
        // 获取新的 scrollTop
        const newSTop = Math.ceil(el.scrollTop)
        // 获取新的 scrollLeft
        const newSLeft = Math.ceil(el.scrollLeft)
        const {
            top,
            right,
            bottom,
            left
        } = getUsableOffset()
        // 重新判断是否触顶
        let isNewReachTop = newSTop <= top
        // 重新判断是否到达最右侧
        let isNewReachRight = newSLeft + el.clientWidth >= el.scrollWidth - right
        // 重新判断是否触底
        let isNewReachBottom = newSTop + el.clientHeight >= el.scrollHeight - bottom
        // 重新判断是否到达最左侧
        let isNewReachLeft = newSLeft <= left
        const params = {
            // 对比新旧两轮触顶值是否有差异。如果不进行比对，则会重复触发触顶逻辑
            isReachTop: !isReachTop && isNewReachTop,
            // 对比新旧两轮是否到达最右侧值是否有差异。如果不进行比对，则会重复触发到达最右侧逻辑
            isReachRight: !isReachRight && isNewReachRight,
            // 对比新旧两轮触底值是否有差异。如果不进行比对，则会重复触发触底逻辑
            isReachBottom: !isReachBottom && isNewReachBottom,
            // 对比新旧两轮是否到达最左侧值是否有差异。如果不进行比对，则会重复触发到达最左侧逻辑
            isReachLeft: !isReachLeft && isNewReachLeft,
        }
        sTop = newSTop
        sLeft = newSLeft
        isReachTop = isNewReachTop
        isReachRight = isNewReachRight
        isReachBottom = isNewReachBottom
        isReachLeft = isNewReachLeft
        return params
    }

    /**
     * @desc
     * @return {{top: number, left: number, bottom: number, right: number}}
     */
    function getUsableOffset() {
        return {
            // 当可滚动的距离 < 设定顶部偏移距离，则设为 0，因为永远无法到达该设定的顶部偏移值
            top: el.scrollHeight - el.clientHeight < offsetTop ? 0 : offsetTop,
            // 当可滚动的距离 < 设定右侧偏移距离，则设为 0，因为永远无法到达该设定的右侧偏移值
            right: el.scrollWidth - el.clientWidth < offsetRight ? 0 : offsetRight,
            // 当可滚动的距离 < 设定底部偏移距离，则设为 0，因为永远无法到达该设定的底部偏移值
            bottom: el.scrollHeight - el.clientHeight < offsetBottom ? 0 : offsetBottom,
            // 当可滚动的距离 < 设定左侧偏移距离，则设为 0，因为永远无法到达该设定的左侧偏移值
            left: el.scrollWidth - el.clientWidth < offsetLeft ? 0 : offsetLeft
        }
    }

    function noop() {
    }

    function destroy() {
        el.removeEventListener('scroll', handleScroll)
    }

    return destroy
}
