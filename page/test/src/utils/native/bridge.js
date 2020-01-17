/* eslint-disable no-alert,prefer-spread,no-empty,no-shadow,no-console */
/**
 * bridge
 * @author Xiaolong
 */
import { IS_ANDROID, IS_LOCAL } from 'src/constants/envs';
import { isFunction, log, errorLog } from '../extend';

if (!window.$$) window.$$ = {};
if (!window.$$.platformAdapter) window.$$.platformAdapter = {};

const { slice } = Array.prototype;
const { toString } = Object.prototype;

// 回调函数集
const _handlers = {};
window.$$.platformAdapter.callback = function (method) {
  const args = slice.call(arguments, 1);
  const callback = (_handlers[method] && _handlers[method].handler) || null;
  const type = (_handlers[method] && _handlers[method].type) || null;
  if (args[1] && typeof args[1] === 'string' && args[1] !== '') {
    let _arg = args[1];
    try {
      if (_arg.indexOf('{') === 0) {
        _arg = JSON.parse(_arg);
      } else {
        try {
          _arg = JSON.parse(decodeURIComponent(_arg.replace(/\+/g, ' ')));
        } catch (e) {
          _arg = JSON.parse(decodeURIComponent(decodeURIComponent(_arg).replace(/\+/g, ' ')));
        }
      }
      args[1] = _arg;
    } catch (e) {
      try {
        args[1] = args[1].replace(/\r\n/g, '');
        try {
          // console.log('try 4');
          args[1] = JSON.parse(decodeURIComponent(args[1]));
        } catch (e) {
          args[1] = JSON.parse(decodeURIComponent(decodeURIComponent(args[1])));
        }
      } catch (e) {
        try {
          args[1] = JSON.parse(decodeURI(args[1]));
        } catch (e) {
          try {
            args[1] = JSON.parse(decodeURI(decodeURI(args[1])));
          } catch (e) {

          }
        }
      }
    }
  }

  if (callback && toString.call(callback) === '[object Function]') {
    callback.apply(window, args);
  }
  if (type) delete _handlers[method];
};
let count = 0;
const errHandler = (error) => {
  switch (error.code) {
    case '001':
      return {
        flag: 'F',
        code: 'native_001_应用错误',
        msg: 'Application error, please try again later.',
        data: {},
        realMsg: error.msg || '',
        realCode: error.realCode || '',
        httpStatusCode: error.httpStatusCode || '',
      };

    case '002':
      return {
        flag: 'F',
        code: 'native_002_没有连接网络',
        msg: 'Slow or no internet connection, please check the internet settings or try again later.',
        data: {},
        realMsg: error.msg || '',
        realCode: error.realCode || '',
        httpStatusCode: error.httpStatusCode || '',
      };

    case '003':
      return {
        flag: 'F',
        code: 'native_003_网络超时',
        msg: 'Slow or no internet connection, please check the internet settings or try again later.',
        data: {},
        realMsg: error.msg || '',
        realCode: error.realCode || '',
        httpStatusCode: error.httpStatusCode || '',
      };

    case '004':
      return {
        flag: 'F',
        code: 'native_004_服务器发生异常',
        msg: 'Slow or no internet connection, please check the internet settings or try again later.',
        data: {},
        realMsg: error.msg || '',
        realCode: error.realCode || '',
        httpStatusCode: error.httpStatusCode || '',
      };

    case '005':
      return {
        flag: 'F',
        code: 'native_005',
        msg: error.msg || 'Slow or no internet connection, please check the internet settings or try again later.',
        data: {},
        realMsg: error.msg || '',
        realCode: error.realCode || '',
        httpStatusCode: error.httpStatusCode || '',
      };
    default:
      return {
        flag: 'F',
        code: 'native_other_未知错误',
        msg: 'Unknown error, please try again later.',
        data: {},
        realMsg: error.msg || '',
        realCode: error.realCode || '',
        httpStatusCode: error.httpStatusCode || '',
      };
  }
};

const __handlersErrorCallback__ = arg => function (error) {
  if (!error) {
    arg.apply(window, slice.call(arguments, 1));
  } else {
    arg.apply(window, [errHandler(error)]);
  }
};
const __createFnKey__ = (callback, method, type) => {
  count = count || 1;
  const _key = [method || '__', count].join('_');
  count += 1;
  _handlers[_key] = {
    type,
    handler: __handlersErrorCallback__(callback),
  };
  return _key;
};
const __params__ = (method, data, callback = {}, type) => {
  const result = {
    data,
  };
  Object.keys(callback).forEach((item) => {
    const fn = callback[item];
    if (isFunction(fn)) result[item] = __createFnKey__(fn, method, type);
  });
  return result;
};
/*
* 调用Native方法
* @param method 方法名称
* @param params 请求数据
* */
const __call = (method, params) => {
  if (IS_ANDROID) {
    const result = `call://${method}("${params}")`;
    if (!IS_LOCAL) {
      if (method !== 'request') log(`${method} 开始调用 : ${params}`);
      // 调用原生方法
      if (window.loan_android_js && typeof window.loan_android_js.execute === 'function') {
        window.loan_android_js.execute(result);
      } else {
        prompt(result);
      }
    }
  } else {
    const businessClass = window['360loan'];
    try {
      if (businessClass && businessClass[method]) {
        businessClass[method].apply(businessClass, [params]);
      } else {
        window.YDIOS[method].apply(window.YDIOS, [params]);
      }
    } catch (e) {

    }
  }
};
// 执行后删除回调
export const callOne = (method, data = {}, callback) => {
  call(method, data, callback, true);
};
export const callNative = (method, data = {}, fns = []) => new Promise((resolve) => {
  const _keys = [];
  const loop = setTimeout(() => {
    errorLog(`bridge.js__调用 ${method} 超时`);
    resolve(null);
    if (_keys && _keys.length > 0) _keys.forEach(_key => delete _handlers[_key]);
  }, 40000);
  const createCallback = name => function () {
    const [param = {}] = arguments;
    clearTimeout(loop);
    const { flag = 'F', data = null, msg } = param;
    if (flag === 'S') {
      resolve({
        result: data || param,
        name,
        args: arguments,
      });
    } else {
      errorLog(` bridge.js__调用 ${method}错误 :___${msg}`);
      resolve({
        result: null,
        name,
        args: arguments,
      });
    }
  };
  const callbacks = {};
  fns.forEach((item) => {
    callbacks[item] = createCallback(item);
  });

  const params = __params__(method, data, callbacks, true);
  fns.forEach((item) => {
    _keys.push(params[item]);
  });
  __call(method, JSON.stringify(params));
});

/*
* method 方法
* data 数据
* type 是否清除监听
* resolve 成功返回数据，失败返回null
* */
const call = (method, data = {}, type = true) => new Promise((resolve) => {
  if (IS_LOCAL) resolve(null);
  let _key = null;

  const loop = setTimeout(() => {
    errorLog(`调用 ${method} 超时`);
    if (_key) delete _handlers[_key];
    resolve({
      ERROR_TAG: 1,
    });
  }, 3000);
  const { isTimeOut = false, noCallback = false } = data;
  if (isTimeOut) clearTimeout(loop);
  delete data.isTimeOut;
  if (noCallback) clearTimeout(loop);
  delete data.noCallback;
  const callback = function () {
    const [param = {}] = arguments;
    log(`${method} 调用完成:`, param);
    clearTimeout(loop);
    const { flag = 'F', data = null, msg } = param;
    if (flag === 'S') resolve(data || param, arguments);
    else {
      errorLog(`调用 ${method}___${msg}`);
      resolve({
        ...param,
        ...{
          ERROR_TAG: 1,
        }, 
      });
    }
  };
  const params = __params__(method, data, { callback }, type);
  _key = params.callback;
  __call(method, JSON.stringify(params));
});


export default call;
