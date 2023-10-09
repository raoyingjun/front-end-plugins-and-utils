(function (win) {
  win.ScrollEdgeWatcher = ScrollEdgeWatcher;

  /**
   * @description 通过监听器可监听触达各个方向事件，具体参数请参阅配置项。
   * @param {HTMLElement | string} el - 要监听的目标。请勿直接监听 window、document、document.body、document.documentElement 对象。监听这些对象可能会导致意想不到的效果，致使监听器无法正常工作
   * @param {Object} options  {Options} options - 滚动监听配置项
   * @param {Function} [options.onReachTop] - 到达顶端时触发该事件。
   * @param {Function} [options.onReachRight] - 到达最右边时触发该事件。
   * @param {Function} [options.onReachBottom] - 到达底部时触发该事件。
   * @param {Function} [options.onReachLeft] - 到达最左边时触发该事件。
   * @param {number} [options.offset=0] - 当距离各边距的位置满足偏移时触发事件
   * @param {number} [options.offsetTop=options.offset] - 距离顶端的位置满足偏移时触发事件，不进行设置则回退使用 offset 的值
   * @param {number} [options.offsetRight=options.offset] - 距离最右边的位置满足偏移时触发事件，不进行设置则回退使用 offset 的值
   * @param {number} [options.offsetBottom=options.offset] - 距离底部的位置满足偏移时触发事件，不进行设置则回退使用 offset 的值
   * @param {number} [options.offsetLeft=options.offset] - 距离最左边的位置满足偏移时触发事件，不进行设置则回退使用 offset 的值
   * @param {Function} [options.onBeforeWatch] - 监听器应用监听前触发。
   * @param {Function} [options.onScroll] - 监听到滚动时触发。
   * @param {Function} [options.onWatched] - 已开始监听后触发。
   * @param {Function} [options.onStop] - 监听器暂停监听时触发。
   * @param {Function} [options.onStart] - 监听器重启监听时触发。
   * @param {Function} [options.onBeforeDestroy] - 监听器不再进行监听前触发。
   * @param {Function} [options.onDestroyed] - 监听器已不再进行监听后触发。
   */
  function ScrollEdgeWatcher(el, options) {
    if (typeof el === "string") el = document.querySelector(el);
    this.el = el;
    this.stopped = false;
    this.destroyed = false;
    // 初始化并填充缺省参数
    this._options = this._initParams(options);
    // 首轮求取 scrollTop 和 scrollLeft
    this._scroll = this._getScroll();
    // 首轮求取各个方位是否触达边缘
    this._reachEdgeStatus = this._getReachEdgeStatus();
    // 绑定滚动事件处理函数 this 指向
    this._boundHandleScroll = _handleScroll.bind(this);
    const { onBeforeWatch, onWatched } = this._options;
    onBeforeWatch();
    // 绑定 scroll 事件
    this.el.addEventListener("scroll", this._boundHandleScroll);
    onWatched();
  }

  /**
   * @private
   * @description 初始化参数，将缺省配置项标准化
   * @param {Object} options 配置项
   * @return {Object} opts 标准化后的配置项
   */
  ScrollEdgeWatcher.prototype._initParams = function (options) {
    const opts = {};
    // 初始化偏移相关参数
    opts.offset = options.offset ?? 0;
    opts.offsetTop = options.offsetTop ?? opts.offset;
    opts.offsetRight = options.offsetRight ?? opts.offset;
    opts.offsetBottom = options.offsetBottom ?? opts.offset;
    opts.offsetLeft = options.offsetLeft ?? opts.offset;
    // 初始化触达相关事件
    opts.onReachTop = (options.onReachTop || noop).bind(this.el, this.el);
    opts.onReachRight = (options.onReachRight || noop).bind(this.el, this.el);
    opts.onReachBottom = (options.onReachBottom || noop).bind(this.el, this.el);
    opts.onReachLeft = (options.onReachLeft || noop).bind(this.el, this.el);
    // 初始化相关钩子函数
    opts.onBeforeWatch = (options.onBeforeWatch || noop).bind(this.el, this.el);
    opts.onScroll = (options.onScroll || noop).bind(this.el, this.el);
    opts.onWatched = (options.onWatched || noop).bind(this.el, this.el);
    opts.onStop = (options.onStop || noop).bind(this.el, this.el);
    opts.onStart = (options.onStart || noop).bind(this.el, this.el);
    opts.onBeforeDestroy = (options.onBeforeDestroy || noop).bind(
      this.el,
      this.el
    );
    opts.onDestroyed = (options.onDestroyed || noop).bind(this.el, this.el);
    return opts;
  };

  /**
   * @private
   * @description 滚动事件处理函数
   */
  function _handleScroll() {
    if (this.stopped) return;
    const { onReachTop, onReachRight, onReachBottom, onReachLeft, onScroll } =
      this._options;
    const { isReachTop, isReachRight, isReachBottom, isReachLeft } =
      this._getEdgeMatchedDiff();
    isReachTop && onReachTop();
    isReachRight && onReachRight();
    isReachBottom && onReachBottom();
    isReachLeft && onReachLeft();
    onScroll();
  }

  /**
   * @private
   * @description 对比新旧两轮是否触达边界并返回各个方向对比后的是否触达边界的结果
   * @param {HTMLElement} el
   * @return {{isReachTop: boolean, isReachRight: boolean, isReachBottom: boolean, isReachLeft: boolean}}
   */
  ScrollEdgeWatcher.prototype._getEdgeMatchedDiff = function () {
    // 获取新一轮是否到达边界的值
    let newReachEdgeStatus = this._getReachEdgeStatus();
    const params = {
      // 上次没有触顶但这次触顶了。如果不进行比对，则会重复触发触顶逻辑，并且也会误判触顶方向问题，导致向下滚动也会触顶逻辑
      isReachTop:
        !this._reachEdgeStatus.isReachTop && newReachEdgeStatus.isReachTop,
      // 上次没有到达最右侧但这次到达最右侧了。如果不进行比对，则会重复触发到达最右侧逻辑，并且也会误判到达最右侧方向问题，导致向左滚动也会到触发到达最右侧的逻辑
      isReachRight:
        !this._reachEdgeStatus.isReachRight && newReachEdgeStatus.isReachRight,
      // 上次没有触底但这次触底了。如果不进行比对，则会重复触发触底逻辑，并且也会误判触顶方向问题，导致向上滚动也会触底逻辑
      isReachBottom:
        !this._reachEdgeStatus.isReachBottom &&
        newReachEdgeStatus.isReachBottom,
      // 上次没有到达最左侧但这次到达最左侧了。如果不进行比对，则会重复触发到达最左侧逻辑，并且也会误判到达最做侧方向问题，导致向右滚动也会到触发到达最左侧的逻辑
      isReachLeft:
        !this._reachEdgeStatus.isReachLeft && newReachEdgeStatus.isReachLeft,
    };
    this._reachEdgeStatus = newReachEdgeStatus;
    return params;
  };

  /**
   * @private
   * @description 获取实际可用的偏移距离
   * @return {{top: number, left: number, bottom: number, right: number}}
   */
  ScrollEdgeWatcher.prototype._getUsableOffset = function () {
    const { offsetTop, offsetRight, offsetBottom, offsetLeft } = this._options;
    return {
      // 当可滚动的距离 < 设定顶部偏移距离，则设为 0，因为永远无法到达该设定的顶部偏移值
      top:
        this.el.scrollHeight - this.el.clientHeight < offsetTop ? 0 : offsetTop,
      // 当可滚动的距离 < 设定右侧偏移距离，则设为 0，因为永远无法到达该设定的右侧偏移值
      right:
        this.el.scrollWidth - this.el.clientWidth < offsetRight
          ? 0
          : offsetRight,
      // 当可滚动的距离 < 设定底部偏移距离，则设为 0，因为永远无法到达该设定的底部偏移值
      bottom:
        this.el.scrollHeight - this.el.clientHeight < offsetBottom
          ? 0
          : offsetBottom,
      // 当可滚动的距离 < 设定左侧偏移距离，则设为 0，因为永远无法到达该设定的左侧偏移值
      left:
        this.el.scrollWidth - this.el.clientWidth < offsetLeft ? 0 : offsetLeft,
    };
  };

  /**
   * @private
   * @description 获取 scrollTop 和 scrollLeft。
   * 注意：在使用显示比例缩放的系统上，scrollTop、scrollLeft 可能会提供一个小数，故向上取整
   */
  ScrollEdgeWatcher.prototype._getScroll = function () {
    return {
      scrollLeft: Math.ceil(this.el.scrollLeft),
      scrollTop: Math.ceil(this.el.scrollTop),
    };
  };
  /**
   * @private
   * @description 计算并返回各个方向是否触达边界
   * @return {{isReachTop: boolean, isReachRight: boolean, isReachBottom: boolean, isReachLeft: boolean}}
   */
  ScrollEdgeWatcher.prototype._getReachEdgeStatus = function () {
    const { top, right, bottom, left } = this._getUsableOffset();
    this._scroll = this._getScroll();
    return {
      // 判断是否触顶
      isReachTop: this._scroll.scrollTop <= top,
      // 判断是否到达最右侧
      isReachRight:
        this._scroll.scrollLeft + this.el.clientWidth >=
        this.el.scrollWidth - right,
      // 判断是否触底.
      isReachBottom:
        this._scroll.scrollTop + this.el.clientHeight >=
        this.el.scrollHeight - bottom,
      // 判断是否到达最左侧
      isReachLeft: this._scroll.scrollLeft <= left,
    };
  };

  ScrollEdgeWatcher.prototype.destroy = function () {
    if (!this.destroyed) {
      const { onBeforeDestroy, onDestroyed } = this._options;
      onBeforeDestroy();
      this.el.removeEventListener("scroll", this._boundHandleScroll);
      onDestroyed();
      this.destroyed = true;
    }
  };
  ScrollEdgeWatcher.prototype.stop = function () {
    const { onStop } = this._options;
    this.stopped = true;
    onStop();
  };
  ScrollEdgeWatcher.prototype.start = function () {
    const { onStart } = this._options;
    this.stopped = false;
    onStart();
  };

  /**
   * @private
   * @description 空函数，什么都不左，在没有对应事件处理函数的时候调用空函数来代替
   */
  function noop() {}
})(window);
