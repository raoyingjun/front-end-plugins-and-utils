;(function (name, factory) {
    if (typeof exports === 'object' && typeof module === 'object') module.exports = factory()
    else window[name] = factory()
})('qs', function () {
    function decode(value) {
        return decodeURIComponent(value)
    }
    function encode(value) {
        return encodeURIComponent(value)
    }
    function is(cls, instance) {
        return '[object ' + cls + ']' === Object.prototype.toString.call(instance)
    }
    function toUrlParamKeyValue(key, value, autoEncode) {
        if (autoEncode) key = encode(key)
        if (value instanceof Array) return toUrlParamKeyArray_value(key, value, autoEncode)
        else return toUrlParamKeyCommon_value(key, value, autoEncode)
    }
    function encodeArray(value) {
        return value = value.map(function (val) {
            return encode(val)
        })
    }
    function toUrlParamKeyCommon_value(key, value, autoEncode) {
        if (autoEncode) value = encode(value)
        return key + '=' + value + '&'
    }
    function toUrlParamKeyArray_value(key, value, autoEncode) {
        if (autoEncode) value = encodeArray(value)
        value = value.map(function (val) {
            return key + '=' + val + '&'
        })
        return value.join('')
    }
    function toObjectKeyValue(obj, key, value) {
        if (obj.hasOwnProperty(key)) toObjectKeyArray_value(obj, key, value)
        else obj[key] = value
    }

    function toObjectKeyArray_value(obj, key, value) {
        var tempValue
        if (!is('Array', tempValue)) {
            tempValue = obj[key]
            obj[key] = []
            obj[key].push(tempValue)
        }
        obj[key].push(value)
    }
    function toObject(url) {
        var matches,
            obj = {},
            i,
            len,
            key,
            value
        url = url.substr(url.lastIndexOf('?') + 1)
        matches = url.split('&')
        for (i = 0, len = matches.length; i < len; i++) {
            item = matches[i].split('=')
            key = item[0]
            value = item[1]
            toObjectKeyValue(obj, key, value)
        }
        return obj
    }
    function toUrlParam(obj, autoEncode) {
        var keys = Object.keys(obj),
            i,
            len,
            key,
            value,
            str = ''
        for (i = 0, len = keys.length; i < len; i++) {
            key = keys[i]
            value = obj[key]
            str += toUrlParamKeyValue(key, value, autoEncode)
        }
        return str.substring(0, str.length - 1)
    }
    return {
        parseUrl: function (url, autoToObject, autoDecode) {
            if (!is('String', url)) return {}
            if (!(autoDecode === false)) url = decode(url)
            if (!(autoToObject === false)) return toObject(url)
            return url
        },
        toUrlParam: function (obj, autoEncode) {
            if (!is('Object', obj)) return ''
            return toUrlParam(obj, !(autoEncode === false))
        }
    }
})