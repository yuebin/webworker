# webworker  一个简易的Worker工具

src 源码，未压缩。
test 测试目录

### 主要功能

需要先加载配置的模块，然后通过
`WebUtil.executeAction(action,callfun);`来执行异步Action。
```
WebUtil.copy(src,function(des){
    //des 复制后的对象。
});
```
