document.addEventListener('load',function(){
    console.log('load');
    console.log('load');
});

let uadWorker = new WorkerUtil();

let initWorker = function(){
    let workerConfig = {
        modules: [
            {
                module:"common",
                jsPath:"WorkerTestDemo.js"
            }
        ]
    };

    uadWorker.loadConfig(workerConfig);
}

let testWorker = function(){
    let action = {
        code:"testWorker",
        module:"common",
        params:null
    };
    uadWorker.executeAction(action,function(result){
        console.error(result);
    });
}

let copy = function(){
    let obj = {a:1,b:2};
    uadWorker.copy(obj,function(dest){
        dest.a = new Date().getTime();
        console.error(dest);
        console.error(obj);
    });
}