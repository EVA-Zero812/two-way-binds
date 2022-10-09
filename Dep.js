// 订阅器，更新需要更新的数据
function Dep() {
    this.subs = [];
}
// 添加订阅
Dep.prototype.addSub = function (sub) {
    this.subs.push(sub);
}
// 通知更新
Dep.prototype.notify = function () {
    this.subs.forEach(sub => {
        // 每个 sub 都是一个 Watcher 实例
        sub.update();
    })
}
// 标识，用于 Dep 中初始化一个 Watcher
Dep.target = null;

export default Dep;