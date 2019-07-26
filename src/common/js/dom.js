/**
 * Created by Administrator on 2017/9/11 0011.
 */
// 判断是否还有类
export function hasClass(el, className) {
    const reg = new RegExp('(^|\\s)' + className + '(\\s|$)');
    return reg.test(el.className);
}
// 获取data属性的数据
export function getData(el, name, val) {
    const prefix = 'data-';
    name = prefix + name;
    if (val) {
        // 如果有第三个参数，设置set
        return el.setAttribute(prefix + name, val);
    } else {
        // 如果只有两个参数，做get操作
        return el.getAttribute(name);
    }
}
// 获取浏览器厂商
let elementStyle = document.createElement('div').style;
let vendor = (() => {
    let transformNames = {
        webkit: 'webkitTransform',
        Moz: 'MozTransform',
        O: 'OTransform',
        ms: 'msTransform',
        standard: 'transform',
    };
    for (let k in transformNames) {
        if (elementStyle[transformNames[k]] !== undefined) {
            return k;
        }
    }
    // 如果循环完所有的都不支持， 就返回false.浏览器问题
    return false;
})();
export function prefixStyle(style) {
    if (vendor === false) {
        return false;
    }
    if (vendor === 'standard') {
        return style;
    }
    return vendor + style.charAt(0).toUpperCase() + style.substr(1);
}
// 添加CLASS
export function addClass(el, className) {
    if (hasClass(el, className)) {
        return;
    }
    let newClass = el.className.split(' ');
    newClass.push(className);
    el.className = newClass.join(' ');
}
