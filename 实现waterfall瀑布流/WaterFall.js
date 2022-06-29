;(function (w, d) {
    function setPos(el, x, y) {
        el.style.left = x + 'px'
        el.style.top = y + 'px'
    }

    function getPosY(el) {
        return parseFloat(el.style.top || 0)
    }

    /**
     * @param {Object} options
     * @param {HTMLElement | string} options.el 挂载到哪个根元素
     * @param {number} options.col 定义总共的列数
     * @param {number} [options.gap=10] 每列水平之间的间隙，默认值为10
     * @constructor
     */
    function WaterFall(options) {
        this.el = options.el // 容器元素
        if (typeof this.el === 'string') this.el = d.querySelector(this.el)
        this.el.style.position = 'relative'
        this.col = options.col // 共几列
        this.gap = options.gap || 10
        this.colWidth = (this.el.clientWidth - (this.gap * (this.col - 1))) / this.col // 列宽
        this.colMaxHeightList = new Array(this.col) // 记录每列最高的项目的高度
        this.index = 0 // 记录已经处理过的项目下标
    }

    /**
     *
     * @param {Array} list
     * @return {number}
     */
    function getMinHeightIndex(list) {
        var minIndex = 0
        for (var i = 1, len = list.length; i < len; i++) {
            if (list[minIndex] > list[i]) {
                minIndex = i
            }
        }
        return minIndex
    }

    /**
     * 当你的页面窗口大小发生改变等时候，使waterfall适应新的页面布局
     */
    WaterFall.prototype.resize = function () {
        this.index = 0
        this.colWidth = (this.el.clientWidth - (this.gap * (this.col - 1))) / this.col // 列宽
        this.notify()
    }
    /**
     * 通知WaterFall页面改变了，将元素瀑布流化
     */
    WaterFall.prototype.notify = function () {
        var children = this.el.children
        for (var i = this.index, len = children.length; i < len; i++) {
            var el = children[i]
            el.style.width = this.colWidth + 'px'
            el.style.position = 'absolute'
            if (i < this.col) {
                setPos(el, i * (this.colWidth + this.gap), 0)
                this.colMaxHeightList[i] = getPosY(el) + el.offsetHeight + this.gap
            } else {
                var minIndex = getMinHeightIndex(this.colMaxHeightList)
                var minHeight = this.colMaxHeightList[minIndex]
                setPos(el, minIndex * (this.colWidth + this.gap), minHeight)
                this.colMaxHeightList[minIndex] = minHeight + el.offsetHeight + this.gap
            }
            this.index++
        }
        this.el.style.height = Math.max.apply(null, this.colMaxHeightList) - this.gap + 'px'
    }
    w.WaterFall = WaterFall
})(window, document)
