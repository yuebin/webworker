var UWorkerConfig = /** @class */ (function () {
    function UWorkerConfig() {
        this.config = {};
    }
    return UWorkerConfig;
}());

var UWorkerConfigEntity = /** @class */ (function () {
    function UWorkerConfigEntity(config) {
        this.module = "share";
        if (config) {
            this.module = config.module || "common";
            this.jsPath = config.jsPath;
            this.scope = config.scope || 'share';
if (!this.jsPath) {
                console.error("JS path is not null.");
            }
        }
    }
    return UWorkerConfigEntity;
}());

var WorkerAction = /** @class */ (function () {
    function WorkerAction() {
    }
    return WorkerAction;
}());

var WorkerUtil = /** @class */ (function () {
    function WorkerUtil() {
        this.modules = new Array();
        this.workerMap = {};
    }


    WorkerUtil.prototype.loadConfig = function (workerConfig) {
        this._workerConfig = workerConfig;
        //解析模块配置
        this.parseModuleConfig();
        //加载模块
        this.loadModule();
    };

    WorkerUtil.prototype.parseModuleConfig = function () {
        var _this = this;
        if (this._workerConfig && this._workerConfig.hasOwnProperty('modules') && this._workerConfig.modules instanceof Array) {
            this._workerConfig.modules.map(function (module) {
                _this.modules.push(new UWorkerConfigEntity(module));
            });
        }
    };

    WorkerUtil.prototype.loadModule = function () {
        var _this = this;
        if (this.modules) {
            this.modules.map(function (configEntity) {
                var loadAction = new WorkerAction();
                loadAction.code = "loadModule";
                loadAction.module = configEntity.module;
                loadAction.params = { path: configEntity.jsPath };
                var moduleName = configEntity.module;
                if (moduleName === "common") {
                    if (!_this.workerMap["common"]) {
                        _this.workerMap["common"] = new Worker("./UWorker.js");
                        _this.workerMap["common"]['queue'] = [];
                        _this.workerMap["common"].onmessage = function (data) {
                            _this.processWorkerModule(data);
                        };
                    }
                }
                else {
                    var worker = new Worker("./UWorker.js");
                    if (_this.workerMap[moduleName]) {
                        console.log(moduleName + " terminate");
                        _this.workerMap[moduleName].terminate();
                    }
                    _this.workerMap[moduleName] = worker;
                    _this.workerMap[moduleName].onmessage = function (data) {
                        _this.processWorkerModule(data);
                    };
                }
                _this.executeAction(loadAction);
            });
        }
    };


    WorkerUtil.prototype.processWorkerModule = function (event) {
        var action = JSON.parse(event.data);
        var moduleName = action._$module;
        if (this.workerMap[moduleName] && this.workerMap[moduleName][action._$id] ){
            var callfun = this.workerMap[moduleName][action._$id];
            if (callfun) {
                try{
                    callfun.call(null, action.result);
                }catch(e){
                    console.error(e);
                }
            }
            delete this.workerMap[moduleName][action._$id];
        }
    };


    WorkerUtil.prototype.executeAction = function (action,callfun) {
        if (this.workerMap[action.module]) {
            var actionId = `_$callback_${new Date().getTime()}_r1${parseInt(Math.random() * 10000)}_r2${ parseInt(Math.random() * 10000)}`;
            this.workerMap[action.module][actionId] = callfun;
            action._$id = actionId;
            action._$module = action.module;
            this.workerMap[action.module].postMessage(action);
        }
    };

    WorkerUtil.prototype.copy = function(any,callfun){
        let action = {
            code: "copy",
            module: "common",
            params: any
        };
        this.executeAction(action, callfun);
    }

    return WorkerUtil;
}());
