import observe from "./observe.js";
import Compile from "./Compile.js";

// Vue 构造函数
const Vue = function ({ el, data, methods }) {
    this.el = el;
    this.data = data;
    this.methods = methods;

    observe(this.data);
    new Compile(el, this);
}

export default Vue;