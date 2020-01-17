/* eslint-disable  */
/**
 * fetch 封装
 * 接口请求封装
 * @author Xiaolong
 */

import axios from 'axios';
import { fetchNative, checkNetState, getRSAEncodeString, logout } from './native';
import { log, errorLog, queryString } from './extend';
import history from './init/history';
import { H5_DEFAULT_COMMON_INFO, MOCK_URL, IS_LOCAL, IS_MOCK } from 'src/constants/envs';
import { LOGIN_INDEX } from 'src/constants/urls';
import { infoOne, close } from 'src/components/modal/toast';
import { getStoreState } from 'src/store';
import Env from 'src/constants/envs';

const instance = axios.create({
  timeout: 10000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});


const NativeRsa = async (params) => {
  if (IS_LOCAL) return { key: '' };
  params.key = new Date().getTime();
  const data = await getRSAEncodeString({
    params: {
      key: JSON.stringify(params)
    }
  });
  return data.params;
};

const dealErr = (data, err, deal) => {
  const { method, url, bizContent } = data;
  const [result] = err;
  let { code = '', msg = '' } = result;
  errorLog(`fetch.js___请求失败：${method || url}`, bizContent, result);
  if (code === 'WLPS01004' || code === 'WLPS00101') {
    logout();
    if (deal.login) {
      const { pathname } = history.location;
      const oldState = history.state || {};
      setTimeout(() => {
        if (LOGIN_INDEX === history.location) return;
        history.push(LOGIN_INDEX, {
          ...oldState, ...{
            loginPath: pathname,
          }
        });
      }, 500);
      return {
        flag: 'F',
        msg: 'Please login again！',
      };
    }
  }
  if (/^S/.test(code)) msg = 'System busy, please try again later.';
  if (code) {
    code = code.toUpperCase();
    if (code.indexOf('NATIVE_002') > -1 || code.indexOf('NATIVE_003') > -1 || code.indexOf('NATIVE_005') > -1) {
      const netState = checkNetState();
      if (!netState) msg = 'Network error, please try again later.';
    }
  }
  return {
    msg,
    err,
  };
};
const dealData = (options, result, deal) => {
  const { method, url, bizContent } = options;
  const { code } = result || {};
  log(`fetch.js__请求成功：${method || url}`, bizContent, result);
  if (code === 'WLPS01004' || code === 'WLPS00101') {
    logout();
    if (deal.login) {
      const { pathname } = history.location;
      const oldState = history.state || {};
      setTimeout(() => {
        if (LOGIN_INDEX === history.location) return;
        history.push(LOGIN_INDEX, {
          ...oldState, ...{
            loginPath: pathname,
          }
        });
      }, 500);
      return {
        flag: 'F',
        msg: 'Please login again！',
      };
    }
  }
  return {
    flag: 'S',
    data: result,
  };
};
const showMsg = (result = {}) => {
  const {
    flag = 'F', msg, data,
  } = result;
  if (flag === 'F') {
    infoOne(msg, true);
    return null;
  }
  return data || 1;
};

const h5Fetch = async (url, method, bizContent, deal, fileMap) => {
  const state = getStoreState();
  const { userLoginInfo } = state.user;
  const { token, userNo } = userLoginInfo;
  const data = {
    ...H5_DEFAULT_COMMON_INFO, ...{
      url,
      method,
      token,
      userNo,
      fileMap,
      timestamp: new Date().getTime(),
      bizContent: JSON.stringify(bizContent),
    }
  };
  const rstData = await instance.post(url, data)
    .then(res => {
      return res.data;
    });
  let rst = {};
  if (rstData.flag === 'S') {
    rst = dealData({
      bizContent,
      url,
      method
    }, rstData.data, deal);
  } else {
    rst = dealErr({
      bizContent,
      url,
      method
    }, [rstData], deal);
  }
  if (deal.msg) return showMsg(rst);
  return rst;
};
const mockFetch = async (method, deal, bizContent) => {
  log(bizContent);
  const rst = await instance.get(MOCK_URL + method)
    .then(res => {
      return res.data;
    })
    .catch(res => {
      log(res.toJSON());
    });
  const { code, data, msg } = rst;
  if (!deal.msg) return rst;
  if (code !== '0') {
    infoOne(msg, true);
    return null;
  }
  return data;
};
const fetch = async (url = '', data = {}, type = 'get', timeout = `${30 * 1000}`, headers = '', deal = {}) => {
  const param = [];
  const { method, fileMap = [] } = data;
  const fileMapList = [].concat(fileMap);
  let { bizContent } = data;
  deal = {
    ...{
      login: 1,
      msg: 1
    },
    ...deal
  };

  // url += [url.indexOf('?') > -1 ? '&' : '?', 'method=', encodeURIComponent(method)].join('');
  if (bizContent.key) {
    const rsaData = await NativeRsa(bizContent.key);
    bizContent = { ...bizContent, ...rsaData };
  }
  bizContent.fileKeys = fileMap.map(item => {
    return item.fileKey;
  });
  if (bizContent.fileKeys.length < 1) delete bizContent.fileKeys;
  if (bizContent.fileMap) delete bizContent.fileMap;
  data.bizContent = JSON.stringify(bizContent);
  if (data && typeof data === 'object') {
    for (const key in data) {
      try {
        param.push(`${key}=${encodeURIComponent(decodeURIComponent(data[key]))}`);
      } catch (e) {
        try {
          param.push(`${key}=${encodeURIComponent(data[key])}`);
        } catch (e) {
          param.push(`${key}=${encodeURIComponent(escape(data[key]))}`);
        }
      }
    }
    data = param.join('&');
  }
  if (queryString('IS_MOCK') || IS_MOCK) return mockFetch(method, deal, bizContent);
  if (IS_LOCAL) return h5Fetch(url, method, bizContent, deal, fileMapList);
  const rst = await fetchNative({
    url,
    type,
    params: data,
    timeout,
    headers,
    fileMap,
  })
    .then((rst) => {
      log({
        url,
        type,
        params: data,
        timeout,
        headers,
        fileMap,
        rst,
      });
      if (!rst) {
        close();
        return {
          flag: 'F',
          msg: 'System error, please try again later.',
        };
      }
      const { result, name, args } = rst;
      if (name === 'successCallback' && result !== null) {
        return dealData({
          method,
          bizContent,
          url,
        }, result);
      }
      return dealErr({
        method,
        bizContent,
        url,
      }, args, deal);
    });

  if (deal.msg) return showMsg(rst);
  return rst;
};

// const Url = 'http://10.94.30.17:8080/api/gateway.do';
let Url = 'http://lps-web-stg.your360loans.in/api/gateway.do';
// let Url = 'http://loanin.dev.com.cn:8080/api/gateway.do';
// let Url = 'http://10.94.90.57:8080/api/gateway.do';
if (__VERSION__ !== '0') Url = 'http://lps-web-stg.your360loans.in/api/gateway.do';

export const post = async (method, data = {}, deal = {}, url = Env.URL) => await fetch(url, {
  method,
  bizContent: data,
  fileMap: data.fileMap
}, 'post', `${30 * 1000}`, '', deal);
export const get = async (method, data = {}, deal = {}, url = Env.URL) => await fetch(url, {
  method,
  bizContent: data,
  fileMap: data.fileMap
}, 'post', `${30 * 1000}`, '', deal);

export default fetch;
