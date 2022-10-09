import Dep from "./Dep.js";

// 订阅者，每一个订阅 sub 都是一个 Watcher 实例
const Watcher = function (vm, property, cb) {
    // vm: 当前需要双向绑定的实例
    // property: v-model 表达式指定的需要绑定的属性
    // cb: 回调函数
    this.vm = vm;
    this.property = property;
    this.cb = cb;
    // 把自己添加到订阅器
    this.value = this.get();
}
Watcher.prototype.get = function () {
    Dep.target = this;
    const value = this.vm.data[this.property]; // 初始化时执行一次 get 方法
    Dep.target = null;
    return value;
}
// todo: 完成 update 函数
Watcher.prototype.update = function () {
    setTimeout(() => {
        const newVal = this.vm.data[this.property];
        const oldVal = this.value;
        if (oldVal !== newVal) {
            this.value = newVal;
            this.cb(newVal, oldVal);
        }
    })

}

export default Watcher;