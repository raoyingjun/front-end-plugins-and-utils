function copyFunction(fn) {
    return new Function('return ' + fn.toString())()
}