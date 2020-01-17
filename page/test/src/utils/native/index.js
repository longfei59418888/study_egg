/**
 * Native方法集合
 * @author Xiaolong
 */
import Env, { IS_MOCK, IS_LOCAL } from 'src/constants/envs';
import { getStoreDispatch } from 'src/store';
import { userLogout } from 'src/actions/user';

import { getUserBuriedInfo } from 'src/utils/common';
import { isEmptyObject } from 'src/utils/extend';
import { clearUserInfo } from 'src/pages/index/utils';
import call, { callOne, callNative } from './bridge';
import { infoOne, loadingOne, close } from '../../components/modal/toast';
import history from '../init/history';
import { LOGIN_INDEX, SETTING_INDEX_RESET_PSW } from '../../constants/urls';
import { API_USER_PWD_SUBMIT } from '../../constants/apis';

const { puppeteerNative } = window;

// 用于自动化测试
const puppeteerNativeProxy = async (name, data) => {
  if (puppeteerNative) {
    loadingOne(`${name}...`);
    const rst = await puppeteerNative(name, data);
    return new Promise((resolve) => {
      setTimeout(async () => {
        close();
        resolve(rst);
      }, 2000);
    });
  }
  return null;
};

// 获取渠道信息
export const getAndroidChannleInfo = async data => call('getAndroidChannleInfo', data);

// 获取当前版本
export const getAppVersion = async data => call('getAppVersion', data);

// 对比版本号
export const compareAppVersion = async (ver) => {
  const rst = await getAppVersion();
  if (!rst) return false;
  const version = rst.version.split('.');
  const verList = ver.split('.');
  let result = -1;
  version.forEach((item, index) => {
    if (parseInt(item) > verList[index] && result === -1) result = 1;
  });
  if (rst.version === ver) result = 0;
  return result;
};

// 设置物理返回是否有效
export const interceptBackPressEvent = async (data) => {
  if (IS_MOCK || IS_LOCAL) {
    return {};
  }
  return call('interceptBackPressEvent', data);
};

// 数据加密
export const getRSAEncodeString = async (data) => {
  if (IS_MOCK) {
    return {};
  }
  return call('getRSAEncodeString', data);
};

// native请求
export const fetchNative = async data => callNative('request', data, ['successCallback', 'failCallback']);

// 获取当前网络状态 state:2G 3G 4G WIFF NONE OHTER
export const reachability = async data => call('reachability', data);

// 检测网络
export const checkNetState = async () => {
  const data = await reachability();
  const { state = 'NONE' } = data;
  if (state !== 'NONE') return state;
  return 0;
};

// 轮询检测网络
export const getNetworkCheck = (bak) => {
  let timer = null;
  const interval = 5000;
  const checkNetState = () => {
    clearTimeout(timer);
    timer = setTimeout(async () => {
      const data = await reachability();
      const { state = 'NONE' } = data;
      if (state === 'NONE') {
        checkNetState();
      } else if (bak) bak();
    }, interval);
  };
  return checkNetState;
};

// 数字键盘
export const numberPad = async data => call('numberPad', data);

// 开启导航
export const setNavActive = async data => call('setNavActive', data);

// 设置导航栏颜色
export const setNavBackgroundColor = async data => call('setNavBackgroundColor', data);

// 分享
export const share = async data => call('share', data);

// 获取通讯记录
export const getInfoLogs = async data => call('getInfoLogs', { ...{ isTimeOut: true }, ...data });

// 获取联系人
export const getContactsInfo = async (data) => {
  const mock = await puppeteerNativeProxy('getContactsInfo', data);
  if (mock) return mock;
  return call('getContactsInfo', { ...{ isTimeOut: true }, ...data });
};

// 获取通讯记录
export const getInstalledApps = async (data) => {
  const mock = await puppeteerNativeProxy('getInstalledApps', data);
  if (mock) return mock;
  return call('getInstalledApps', { ...{ isTimeOut: true }, ...data });
};

// pan ocr 识别
export const panCardOCR = async (data) => {
  const mock = await puppeteerNativeProxy('panCardOCR', data);
  if (mock) return mock;
  if (IS_MOCK || IS_LOCAL) {
    return {
      // ERROR_TAG: 1,
      photoData: '',
      fileId: 'id',
      imageMap: JSON.stringify({
        filePanId: 'test_id',
      }),
      scanResult: JSON.stringify({
        uid: 'uid',
        par1: 'ocr and verification',
        imei_code: '860569042582125',
        status: 'request_status',
        report_id: '201907261006547910005127916',
        comment: 'Sorry, your picture is not clear or too small. Please try to alig the reference text with the corresponding position on the rectangular box and certificate when shooting',
        data: {
          user_name: 'HIMANI  ',
          date_of_birth: '28/MAR/1988',
          user_father_name: 'father_name',
          pan_code: 'EMLMP7320K',
          verified_result: 'pan_report',
        },
      }),
    };
  }
  return call('panCardOCR', { ...{ isTimeOut: true }, ...data });
};

// aadhaar ocr 识别
export const aadhaarOCR = async (data) => {
  const mock = await puppeteerNativeProxy('aadhaarOCR', data);
  if (mock) return mock;
  if (IS_LOCAL || IS_MOCK) {
    return {
      // ERROR_TAG: 1,
      fPhotoData: 'fPhotoData',
      bPhotoData: 'bPhotoData',
      fFileId: 'fFileId',
      bFileId: 'bFileId',
      imageMap: JSON.stringify({
        fileAFId: 'test_fileAFId',
        fileABId: 'test_fileABId',
      }),
      scanResult: JSON.stringify({
        uid: 'uid',
        par1: 'par1',
        imei_code: 'imei_code',
        status: 200,
        report_id: '201907261005057810007887096',
        comment: 'success',
        data: {
          user_name: 'cust_name',
          year_of_birth: 'year_of_birth',
          date_of_birth: 'date_of_birth',
          gender: 'Male',
          aadhaar_no: '380902915742',
          aadress: 'address_info',
        },
      }),
    };
  }
  return call('aadhaarOCR', { ...{ isTimeOut: true }, ...data });
};

// 活体检测
export const livenessRecognition = async (data) => {
  const mock = await puppeteerNativeProxy('livenessRecognition', data);
  if (mock) return mock;
  if (IS_MOCK) {
    return {
      imageMap: JSON.stringify({
        fileAction1: '1',
        fileAction2: '2',
      }),
      scanResult: JSON.stringify({
        report_id: '1',
      }),
    };
  }
  return call('livenessRecognition', { ...{ isTimeOut: true }, ...data });
};

// 设置用户信息
export const setUserInfo = async data => call('setUserInfo', { ...{ isTimeOut: true }, ...data });

// 设置交易密码
export const settingTradersPwd = async (data) => {
  const mock = await puppeteerNativeProxy('settingTradersPwd', data);
  if (mock) return mock;
  if (IS_MOCK) {
    return {
      // ERROR_TAG: 1,
      code: '',
      data: {
        nodeGivenCode: 'TIME_OUT_SET_PAD',
        nextNodeCode: 'CONTACT',
      },
      flag: 'F',
    };
  }
  return call('settingTradersPwd', { ...{ isTimeOut: true }, ...data });
};

// 输入交易密码
export const verTradersPwd = async (param) => {
  let rst = await call('verifyTradersPwd', { ...{ isTimeOut: true }, ...param });
  const mock = await puppeteerNativeProxy('verifyTradersPwd', param);
  if (mock) rst = mock;
  if (IS_MOCK) {
    rst = {
      ERROR_TAG: 1,
      type: 'forget',
    };
  }
  const {
    ERROR_TAG, code, data = {}, msg = '', type = '', flag,
  } = rst;
  if (ERROR_TAG) {
    if (flag === 'C' || type === 'cancel') return;
    if (type === 'forget') {
      history.push(SETTING_INDEX_RESET_PSW);
      return;
    }
    infoOne(data.msg || msg || type);
    if (code === 'WLPS01004') {
      setTimeout(() => {
        if (LOGIN_INDEX === history.location) return;
        history.push(LOGIN_INDEX);
      }, 300);
    }
    return null;
  }
  return rst;
};

// 修改密码
export const changePwd = async (param = {}) => {
  const mock = await puppeteerNativeProxy('settingTradersPwd', param);
  if (mock) return mock;
  return call('settingTradersPwd', {
    isTimeOut: true,
    type: 3,
    method: API_USER_PWD_SUBMIT,
    requestUrl: Env.URL,
    businessParams: {
      ...param,
      passwordKey: 'newPwd',
    },
  });
};

// 支付
export const openPayment = async (data) => {
  const mock = await puppeteerNativeProxy('openPayment', data);
  if (mock) return mock;
  return call('openPayment', { ...{ isTimeOut: true }, ...data });
};

// 跳转
export const forwardPage = async data => call('forward', data);

// 返回
export const back = async () => call('back', {});

// 退出
let logoutIng = false;
export const logout = async () => {
  if (logoutIng) return;
  logoutIng = true;
  const userInfo = await userLogout();
  await call('logout', { ...{ isTimeOut: true } });
  if (userInfo) getStoreDispatch(userInfo);
  logoutIng = false;
  clearUserInfo();
};

// 设置指纹信息
export const getDeviceFingerPrintParams = async () => {
  if (IS_MOCK || IS_LOCAL) {
    return {
      fPhotoData: 'fPhotoData',
      bPhotoData: 'bPhotoData',
      fFileId: 'fFileId',
      bFileId: 'bFileId',
    };
  }
  return call('getDeviceFingerPrintParams', {
    ...{ isTimeOut: true },
    isMust: 'N',
  });
};

// 获取地理位置
export const getAddressInfo = async (data) => {
  if (IS_MOCK || IS_LOCAL) {
    return {
      flag: 'S',
      msg: '',
      data: {
        latitude: '22.538200968200766',
        longitude: '114.07462567757082',
        country: '中国',
        adminInfo: '广东省',
        subAdminInfo: '福田街道',
        locality: '深圳市',
        subLocality: '福田区',
        thoroughfare: '彩田路',
        addrInfo: '广东省深圳市福田区彩田路2034号',
      }
      ,
    };
  }
  return call('getAddressInfoG', { ...{ isTimeOut: true }, ...data });
};

// 执行某一个native方法,之前检查版本号
export const proxyMethodPreCompareVersion = async (method, data, version) => {
  if (version) {
    const isDispath = await compareAppVersion(version);
    if (isDispath < 0) return isDispath;
  }
  const rst = await method(data);
  return rst;
};

// openDebugPage
export const openDebugPage = async data => call('openDebugPage', data);

// 埋点事件上报
export const onEvent = (eventId, customParam = {}) => {
  if (IS_MOCK || IS_LOCAL) return;
  const { userId = true, stateId = false } = customParam; // 因为user参数为大部分埋点需要传，所以设为默认
  const addUser = {};
  if (userId || stateId) {
    const { user, userStatus } = getUserBuriedInfo();
    if (userId) { addUser.user = user || ''; } else { addUser.user = ''; }
    if (stateId) addUser.userStatus = userStatus || '';
  }
  delete customParam.userId;
  delete customParam.stateId;
  const data = {
    eventId,
    customAttributes: {
      ...customParam,
      ...addUser,
    },
  };
  if (isEmptyObject(customParam)) delete data.customAttributes;
  return call('onEvent', { ...{ noCallback: true }, ...data });
};

export default callOne;
