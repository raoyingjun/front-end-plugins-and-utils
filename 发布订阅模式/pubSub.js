(function (win) {
    var subjects = {}; // 要订阅的目标
    var pubSub = {
        subscribe: function (subject, callback) {
            if (!subjects[subject]) subjects[subject] = [];
            subjects[subject].push(callback);

        },
        unsubscribe: function (subject, callback) {
            if (!callback) {
                subjects[subject] = [];
                return;
            }
            if (subjects[subject] && subjects[subject].length){
                var tempCallbacks = [];
                subjects[subject].forEach(function (cb) {
                    if (callback !== cb) {
                        tempCallbacks.push(cb);
                    }
                });
                subjects[subject] = tempCallbacks;
            };

        },
        publish: function (subject) {
            if (subjects[subject]) {
                subjects[subject].forEach(function (callback) {
                    callback();
                });
            }
        }
    }
    win.pubSub = pubSub;
})(window);
