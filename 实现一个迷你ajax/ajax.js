;(function (win) {
    function setHeaders (xhr, headers) {
        var headers = headers || {};
        var headerKeys = Object.keys(headers);
        headerKeys.forEach(function (key) {
            xhr.setRequestHeader(key, headers[key]);
        });
    }
    win.ajax = function (options) {
        var xhr = new XMLHttpRequest()
        var progress
        xhr.timeout = options.wait || 0
        options.beforeSend && options.beforeSend.call(xhr, xhr)
        xhr.onprogress = function (event) {
            if (event.total) {
                progress = parseInt((event.loaded / event.total) * 100)
                options.progress && options.progress.call(xhr, progress, event)
            }
        }
        xhr.onloadend = function () {
            options.complete && options.complete.call(xhr, xhr)
        }
        xhr.ontimeout = function (error) {
            options.timeout && options.timeout.call(xhr, error, xhr)
        }
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                options.success && options.success.call(xhr, xhr)
            }
        }
        xhr.onerror = function (error) {
            options.error && options.error.call(xhr, error, xhr)
        }
        xhr.open(options.method || 'get', (options.url || '') + '?' + (options.query || ''), options.async || true)
        setHeaders(xhr, options.headers)
        xhr.send(options.data || '')
        return xhr;
    }
})(window)
