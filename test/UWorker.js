var UWorker = /** @class */ (function () {
    
    function UWorker() {
        this.module = "share";
        this.id = "UWorker_" + new Date().getTime() + " " + new Number(Math.random() * 1000).toFixed(0);
    }

    UWorker.prototype.processMessage = function (event) {
        var action = event.data;
        if (action && action.code === "loadModule") {
            importScripts(action.params.path);
        }
        else if (action && action.code === "copy"){
            action.result = action.params;
            this.sendMsg(action);
        }
        else if (action) {
            if (self[action.module] && self[action.module][action.code]) {
                action.result = self[action.module][action.code].apply(null, action.params);
                this.sendMsg(action);
            }
        }
    };
    UWorker.prototype.sendMsg = function (action) {
        postMessage(JSON.stringify(action));
    };
    return UWorker;
}());

/**
 * 监听主线程发来的消息，执行对应的模块数据
 */
self.onmessage = (function (event) {
    worker.processMessage(event);
});
var worker = new UWorker();
