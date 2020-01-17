
/**
 * 公共方法
 * @author Xiaolong
 */
import qs from 'qs';

const { console, location } = window;

// 日志打印
export function log() {
  if (__ENV__ === 'production') return;
  console.log.apply(this, arguments);
}
export function errorLog() {
  if (__ENV__ === 'production') return;
  console.error.apply(this, arguments);
}
export function warnLog() {
  if (__ENV__ === 'production') return;
  console.warn.apply(this, arguments);
}
export const parse = (jsonString) => {
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    if (__ENV__ === 'production') return;
    console.warn(`${jsonString}___JSON.parse__参数不对`);
    return {};
  }
};


export function queryString(param) {
  const query = qs.parse(location.search.replace('?', ''));
  if (!param) return query;
  return query[param];
}

/*
* 类型判断
* */
const _ARRAY_NAME = '[object Array]';
const _OBJECT_NAME = '[object Object]';
const _FUNCTION_NAME = '[object Function]';

// 得到对象类型
function _isType(obj) {
  return Object.prototype.toString.call(obj);
}

export function isFunction(obj) {
  return _isType(obj) === _FUNCTION_NAME;
}

export function isObject(obj) {
  return _isType(obj) === _OBJECT_NAME;
}

export function isArray(obj) {
  return _isType(obj) === _ARRAY_NAME;
}

export function isEmptyObject(obj) { // 是否是空对象
  for (const t in obj) {
    return false;
  }
  return true;
}


/*
* HTML 属性
* */

// 获取当前css浏览器前缀
export function getVendorPrefix() {
  const body = document.body || document.documentElement;
  const { style } = body;
  const vendor = ['webkit', 'khtml', 'moz', 'ms', 'o'];
  let i = 0;
  while (i < vendor.length) {
    if (typeof style[`${vendor[i]}Transition`] === 'string') {
      return vendor[i];
    }
    i += 1;
  }
}

// 获取 translate 坐标
export function getTranslateInfo(t) {
  const reg = /translate\((.+)px?,(.+)px?\)/;
  const rst = reg.exec(t);
  if (rst) {
    return {
      x: parseFloat(rst[1]),
      y: parseFloat(rst[2]),
    };
  } 
  return {
    x: 0,
    y: 0,
  };
}


/*
* 定时器
* @param time 时间
* @param bak 每次的回调函数 time = -1 时间结束
* @return stop      暂停
* @return reStart   重新开始
* @return clear     清楚定时器
* */
export function clock(time, bak) {
  const startTime = new Date().getTime();
  let STOP = false;
  const setState = (type) => {
    STOP = type;
  };
  let loop = setInterval(() => {
    if (STOP) return;
    const tempTime = new Date().getTime();
    if (bak)bak(time - parseInt((tempTime - startTime) / 1000), 0);
    if ((tempTime - startTime) / 1000 > time || (tempTime - startTime) < 0) {
      if (bak)bak(-1);
      clearInterval(loop);
    }
  }, 1000);
  return {
    stop: () => setState(true),
    reStart: () => setState(false),
    clear: () => {
      clearInterval(loop);
      loop = null;
    },
  };
}

// 切割字符串
export const stringToArray = (str) => {
  const arr = [];
  for (let i = 0; i < str.length; i += 1) {
    arr.push(str.substring(i, 1));
  }
  return arr;
};


/*
* 获取一个节流器
* @param time 间隔时间
* */
export const getThrottle = (time = 500) => {
  const __throttleIngTime = time;
  let __throttleIng = false;
  return () => {
    if (__throttleIng) return true;
    __throttleIng = true;
    setTimeout(() => {
      __throttleIng = false;
    }, __throttleIngTime);
    return false;
  };
};

export const dealPhone = (phone) => {
  phone = phone.replace(/[^\s0-9]/, '');
  phone = phone.replace(/\s+/g, '');
  if (/^\d{5}\d/.test(phone)) phone = `${phone.substr(0, 5)} ${phone.substring(5)}`;
  if (/^\d{5}\s$/.test(phone)) phone = phone.substr(0, 5);
  if (phone.length > 11) phone = phone.substr(0, 11);
  return phone;
};

/*
* 联系人号码
* 长度10~20
* 允许数字字符以及*#空格()-+[],
* 数字字符不少于10位
* */
export const contactPhone = (phone) => {
  const phoneLength = phone.replace(/[^\d]/g, '').length;
  if (parseFloat(phoneLength) < 10) return false;
  // eslint-disable-next-line no-useless-escape
  const isPhone = /^([0-9]|[*#, \-+ \[\]()]){10,20}$/.test(phone);
  return isPhone;
};
