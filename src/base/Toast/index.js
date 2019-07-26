import Vue from 'vue';
import ToastVue from './toast';

let instance;
// 默认配置
const defaultParam = {
    show: true,
    duration: 2000,
    type: 'html',
    message: '消息提示',
    timmer: null,
};

const initInstrance = () => {
    const ToastConstruotcr = Vue.extend(ToastVue);
    instance = new ToastConstruotcr({
        el: document.createElement('div'),
    });
    document.body.appendChild(instance.$el);
};

const Toast = (options = {}) => {
    options = { ...defaultParam, ...options };
    if (!instance) {
        initInstrance();
    }
    clearTimeout(instance.timmer);
    Object.assign(instance, { ...options });
    Vue.nextTick(() => {
        instance.timer = setTimeout(() => {
            instance.show = false;
        }, options.duration);
    });
    return instance;
};

Toast.install = () => {
    Vue.prototype.Toast = Toast;
};

export default Toast;
