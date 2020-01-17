/**
 * 全局配置
 * @author Xiaolong
 */

import {
  SET_GLOBAL_PAGE_SLIDE_CLASS,
  // SET_GLOBAL_INDEX_TAB_INFO,
} from 'src/constants/actions';
// import { BASE_URL } from 'src/constants/envs';
import { createHashHistory } from 'history';
import { getStoreDispatch } from 'src/store';
import { closeAll, getList } from 'src/components/modal/confirm';
import { getModalList } from 'src/components/modal/popup';
import { Toast } from 'antd-mobile';
import { getThrottle, isFunction, log } from '../extend';
import { clearPageTimeout } from '../timeout';
import { INDEX_HOME } from '../../constants/urls';

const SET_TIME = 50;

/*
* history 改造
* */
// 事件列表
const eventList = {};
// 创建自定义 history
// 是否可以返回
let IS_BACK = null;

export const setBack = (fn) => {
  if (isFunction(fn)) IS_BACK = fn;
  else IS_BACK = null;
};


export const clearModalToast = (type = true) => {
  Toast.hide();
  const alertList = getList();
  const modalList = getModalList();
  if (modalList) {
    modalList();
    return type;
  }
  if (alertList.length > 0) {
    closeAll();
    return type;
  }
  return false;
};

const throttle = getThrottle(500);
function createHistory() {
  const history = createHashHistory();
  const {
    push, location, replace,
  } = history;
  const indexPage = '/index/home';
  history.routerList = [];
  history.routerList.push(location.pathname);
  // 重写 history push type 当前滑动方向
  history.push = (path, state, type = 1, hook = {}) => {
    if (throttle()) return;
    const { before = null } = hook;
    if (before) before(history);
    history.routerList.push(path);
    __setGlobalClass(type);
    if (state !== true) history.state = state;
    setTimeout(() => push(path), SET_TIME);
  };
  // 传入path 指定返回位置
  history.goBack = (option = {}, type = 2) => {
    if (IS_BACK) {
      IS_BACK();
      return;
    }
    if (throttle()) return;
    if (clearModalToast()) return;
    const { path = '', state = {} } = option;
    if (state !== true) history.state = state;
    __setGlobalClass(type);
    if (path) {
      if (history.routerList.lastIndexOf(path) !== -1) {
        history.routerList = history.routerList.slice(0, history.routerList.lastIndexOf(path) + 1);
        setTimeout(() => push(path), SET_TIME);
      } else {
        history.routerList = [indexPage];
        setTimeout(() => push(indexPage), SET_TIME);
      }
      return;
    }
    if (history.routerList.length === 1) {
      if (history.routerList[0] !== indexPage) {
        history.routerList = [indexPage];
        setTimeout(() => push(indexPage), SET_TIME);
      }
      return;
    }
    history.routerList.pop();
    setTimeout(() => push(history.routerList[history.routerList.length - 1]), SET_TIME);
  };
  history.replace = (path, state) => {
    if (throttle() && (!state || !state.toLogin)) return;
    history.routerList[history.routerList.length - 1] = path;
    if (state !== true) history.state = state;
    replace(path);
  };
  history.initPage = (state) => {
    history.routerList = [indexPage];
    if (state !== true) history.state = state;
    setTimeout(() => push(indexPage), SET_TIME);
  };

  history.toIndex = () => {
    history.goBack({
      path: INDEX_HOME,
    });
  };


  // 添加监听事件
  history.addListenEvent = (name, handle, type = false) => {
    eventList[name] = {
      one: type,
      handle,
    };
  };
  // 删除监听事件
  history.deleteListenEvent = (name) => {
    delete eventList[name];
  };
  history.listen((locations) => {
    clearPageTimeout();
    if (clearModalToast(false)) return;
    Object.keys(eventList).forEach((item) => {
      const { one, handle } = eventList[item];
      handle(locations);
      if (one) delete eventList[item];
    });
    log(history);
    setBack(null);
  });
  return history;
}
const history = createHistory();

export const toIndex = () => {
  setBack(() => {
    setBack(null);
    history.goBack({
      path: INDEX_HOME,
    });
  });
};

export default history;

function __setGlobalClass(type) {
  getStoreDispatch({
    type: SET_GLOBAL_PAGE_SLIDE_CLASS,
    data: type,
  });
  // if (type !== 0) {
  //   setTimeout(() => {
  //     getStoreDispatch({
  //       type: SET_GLOBAL_PAGE_SLIDE_CLASS,
  //       data: 0,
  //     });
  //   }, 600);
  // }
}
