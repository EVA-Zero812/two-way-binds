import Watcher from './Watcher.js'

// Compile 构造函数
const Compile = function (el, vm) {
    this.el = document.querySelector(el);
    this.vm = vm;
    this.fragment = null;
    this.init();
}

// 初始化
Compile.prototype.init = function () {
    this.fragment = this.nodeToFragment(this.el);
    this.compileFragment(this.fragment);
    this.el.appendChild(this.fragment);
}

// 创建 Fragment
Compile.prototype.nodeToFragment = function (el) {
    const fragment = document.createDocumentFragment();
    let child = el.firstChild;
    while (child) {
        fragment.appendChild(child);
        child = el.firstChild;
    }
    return fragment;
}

// 递归编译
Compile.prototype.compileFragment = function (fragment) {
    const childNodes = fragment.childNodes;
    Array.prototype.slice.call(childNodes).forEach((node) => {
        node.nodeType === Node.ELEMENT_NODE && this.compileElement(node);
        node.nodeType === Node.TEXT_NODE && this.compileText(node);
        if (node.childNodes && node.childNodes.length) {
            this.compileElement(node);
        }
    });
}

// 编译元素标签
Compile.prototype.compileElement = function (node) {
    const nodeAttrs = node.attributes;
    Array.prototype.forEach.call(nodeAttrs, (attr) => {
        const attrName = attr.name;
        const attrValue = attr.value;
        if (attrName.indexOf('v-on:') === 0 || attrName.indexOf('@') === 0) {
            const eventType = attrName.split(/:|@/)[1];
            let event = this.vm.methods[attrValue];
            node.addEventListener(eventType, event.bind(this.vm.data), false);
            node.removeAttribute(attrName);
        }
        if (attrName === 'v-model') {
            let val = this.vm.data[attrValue];
            this.updateModel(node, val);
            new Watcher(this.vm, attrValue, (newVal) => {
                this.updateModel(node, newVal);
            })
            node.addEventListener('input', (e) => {
                const newVal = e.target.value;
                if (newVal === val) return;
                val = newVal;
            })
            node.removeAttribute(attrName);
        }
    })
}

// 编译文本
Compile.prototype.compileText = function (node) {
    var reg = /\{\{(.*)\}\}/;
    const val = node.textContent;
    if (reg.test(val)) {
        const exp = reg.exec(val)[1].trim();
        this.updateText(node, this.vm.data[exp]);
        new Watcher(this.vm, exp, (value) => {
            this.updateText(node, this.vm.data[exp]);
        });
    }
}

// 更新文本
Compile.prototype.updateText = function (node, value) {
    node.textContent = typeof value == 'undefined' ? '' : value;
}

// 更新数据
Compile.prototype.updateModel = function (node, value) {
    node.value = typeof value == 'undefined' ? '' : value;
}

export default Compile;