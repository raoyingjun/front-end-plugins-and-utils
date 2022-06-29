const qs = require('./querystring')
const url = 'https://www.baidu.com?num=10&name=%E4%B8%AD%E5%9B%BD&hobby=englight&hobby=%E4%B8%AD%E6%96%87'
const obj = {
    name: '中国',
    hobby: ['englight', '中文']
}
console.log(qs.toUrlParam(obj))
console.log(qs.parseUrl(url))
