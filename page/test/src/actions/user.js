import {
  USER_LOGIN_INFORM_SMS_SEND,
  USER_MOBILE_LOGIN,
  USER_MOBILE_UNLOGIN,
  GET_USER_INDEX_SUMMARY_INFO,
  CLEAR_USER_INDEX_SUMMARY_INFO,
  GET_USER_CARD_INFO_QUERY,
  GET_USER_PERSONAL_INFO,
} from 'src/constants/actions';
import {
  INFORM_SMS_SEND,
  API_USER_MOBILE_LOGIN,
  USER_SUMMARY_QUERY,
  API_USER_MOBILE_LOGOUT,
  API_USER_CARD_SUBMIT,
  API_USER_CARD_INFO_QUERY,
  USER_PROFILE_QUERY,
} from 'src/constants/apis';
import { DEFAULT_PRODUCT_CODE } from 'src/constants/index/default';
import { post } from 'src/utils/fetch';
import { setUserInfo } from 'src/utils/native';

// 发送登录验证码
export const sendLoginSms = param => async (dispatch) => {
  const data = await post(INFORM_SMS_SEND, param);
  if (data) {
    dispatch({
      type: USER_LOGIN_INFORM_SMS_SEND,
      data: {
        ...param,
        ...data,
        ...{
          sendTimeStart: new Date().getTime(),
        },
      },
    });
  }
  return data;
};
export const sendLoginSmsClear = () => ({
  type: USER_LOGIN_INFORM_SMS_SEND,
  data: {
    sendInterval: 20,
    cdKey: '',
    mobileNo: '',
  },
});

export const saveLoginTel = param => ({
  type: USER_LOGIN_INFORM_SMS_SEND,
  data: {
    mobileNo: param || '',
  },
});
// 登录
export const userLogin = param => async (dispatch) => {
  const data = await post(API_USER_MOBILE_LOGIN, param);
  if (!data) return data;
  dispatch({
    type: USER_MOBILE_LOGIN,
    data,
  });
  await setUserInfo({
    userInfo: data,
  });
  return data;
};

// 注销用户信息
export const userLogout = async (param) => {
  await post(API_USER_MOBILE_LOGOUT, param, { msg: 0, login: 0 });
  return {
    type: USER_MOBILE_UNLOGIN,
  };
};

// 获取首页数据
export const getUserIndexSummaryInfo = (param = {}, time = 0) => async (dispatch, getState) => {
  const preData = getState();
  const { userIndexSummaryInfo } = preData.user;
  if (userIndexSummaryInfo.preTime && userIndexSummaryInfo.preTime + time * 60 * 1000 > new Date().getTime()) {
    return userIndexSummaryInfo;
  }
  const {
    deal = {
      login: 0,
    },
  } = param;
  const data = await post(USER_SUMMARY_QUERY, {
    productCode: DEFAULT_PRODUCT_CODE,
  }, deal);
  if (data) {
    dispatch({
      type: GET_USER_INDEX_SUMMARY_INFO,
      data: {
        ...data,
        ...{
          preTime: new Date().getTime(),
        },
      },
    });
  } else {
    dispatch({
      type: CLEAR_USER_INDEX_SUMMARY_INFO,
    });
  }
  return data;
};

// 添加银行卡
export const addCardInfo = async params => await post(API_USER_CARD_SUBMIT, params);

export const setCardListInfo = param => ({
  type: GET_USER_CARD_INFO_QUERY,
  data: param,
});

// 获取银行卡列表
export const getCardListInfo = () => async (dispatch) => {
  const rst = await post(API_USER_CARD_INFO_QUERY);
  dispatch({
    type: GET_USER_CARD_INFO_QUERY,
    data: rst || [],
  });
  return rst;
};

// 获取个人中心的信息
export const getPersonalInfo = () => async (dispatch) => {
  const rst = await post(USER_PROFILE_QUERY);
  dispatch({
    type: GET_USER_PERSONAL_INFO,
    data: rst || {},
  });
  return rst;
};
