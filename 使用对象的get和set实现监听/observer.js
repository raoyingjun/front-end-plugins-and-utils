function observer (options) {
    const props = options.props || [];
    const obj = {};  
    props.forEach( prop => {
        obj.__defineSetter__(prop.prop, function (newValue) {
            const values = {oldValue: obj['_' + prop.prop], newValue: newValue};
            obj['_' + prop.prop] = newValue;
            prop.handler.call(values, values.oldValue, values.newValue);
        });
        obj.__defineGetter__(prop.prop, function () {
            return obj['_' + prop.prop];
        });
        obj[prop.prop] = prop.value
    });
    return obj;
}