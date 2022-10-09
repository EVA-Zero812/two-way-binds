import Dep from "./Dep.js";

// 监听器，监听所有属性（目前只遍历一层）
const observe = (obj) => {
    if (typeof obj !== 'object') return;
    Object.keys(obj).forEach((key, index) => {
        defineReactive(obj, key, obj[key]);
    })
}
const defineReactive = (obj, key, val) => {
    const dep = new Dep();
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: function getter() {
            // 将 watcher 初始化到 Dep 中
            Dep.target && dep.addSub(Dep.target);
            return val;
        },
        set: function setter(newVal) {
            // 通知更新
            dep.notify();
            val = newVal;
        }
    })
}

export default observe