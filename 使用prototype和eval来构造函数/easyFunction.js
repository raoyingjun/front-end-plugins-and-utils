function easyFunction (o) {
    eval('function ' + o.constructor + '(){}');
    const fn = eval(o.constructor);
    fn.prototype = o.data;
    o.data.constructor = fn;
    return fn;
};