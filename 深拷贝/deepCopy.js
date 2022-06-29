(function (win) {
    win.deepCopy = deepCopy

    function deepCopy(obj) {
        var newObj, keyType

        switch (getType(obj)) {
            case '[object Object]':
                newObj = {}
                break
            case '[object Array]':
                newObj = []
                break
            default:
                return obj
        }

        for (var key in obj) {
            keyType = getType(obj[key])
            if (keyType === '[object Object]' || keyType === '[object Array]') {
                newObj[key] = deepCopy(obj[key])
            } else {
                newObj[key] = obj[key]
            }
        }

        return newObj
    }

    function getType(obj) {
        return Object.prototype.toString.call(obj)
    }
})(window)