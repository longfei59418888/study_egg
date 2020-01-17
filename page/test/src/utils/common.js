/**
 * 公共方法
 * @author Xiaolong
 */
import React from 'react';
import { getStoreState } from 'src/store';
import axios from 'axios';
import { oneConfirm, oneSuccess } from '../components/modal/confirm';
import history from './init/history';
import { onEvent } from './native';
import { errorLog } from './extend';

const { location } = window;


export const isLogin = () => {
  const state = getStoreState();
  const { userLoginInfo } = state.user;
  const { token = '', userNo = '' } = userLoginInfo;
  return !!(token && userNo);
};

export const callPhone = (tel = '', eventId) => {
  onEvent(eventId);
  oneConfirm({
    hasClose: false,
    msg: <p className="flex-center rmed fw5 font38 lh53 fcolor1" style={{ width: '5.6rem', paddingTop: '0.12rem' }}>0097654322</p>,
    okText: 'Call',
    cancelText: 'Cancel',
    ok: () => {
      window.location.href = `tel:${tel}`;
    },
  });
};

export const showEmail = (eventId) => {
  onEvent(eventId);
  oneSuccess({
    hasClose: false,
    msg:
  <p className="flex-center t-center rmed fw5 font38 fcolor1" style={{ paddingTop: '0.12rem' }}>
customerservice
    <br />
@your360loans.com
  </p>,
    okText: 'Ok',
    ok: () => {
    },
  });
};
// 刷新app
export const refreshApp = () => {
  history.initPage();
  setTimeout(() => {
    location.reload();
  }, 200);
};

// 获取合同协议
export const getProtocol = async (url) => {
  const instance = axios.create({
    timeout: 10000,
    headers: {
      Accept: 'text/html',
      'Content-Type': 'text/html',
    },
  });
  const rst = await instance.get(url)
    .then(res => res)
    .catch((res) => {
      errorLog(res.toJSON());
    });
  const { data } = rst;
  return data;
};

// 获取埋点数据
export const getUserBuriedInfo = () => {
  const state = getStoreState();
  const { userLoginInfo, userIndexSummaryInfo } = state.user;
  const { userState } = userIndexSummaryInfo;
  const { userNo } = userLoginInfo;
  const data = {
    userStatus: userState || '',
    user: userNo || '',
  };
  return data;
};
