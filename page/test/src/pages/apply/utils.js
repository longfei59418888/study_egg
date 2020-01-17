/**
 * 授信的处理方法
 * @author Xiaolong
 */
import {
  panCardOCR, aadhaarOCR, livenessRecognition, settingTradersPwd,
  getInstalledApps, getContactsInfo, getAddressInfo, verTradersPwd,
  getRSAEncodeString, onEvent,
} from 'src/utils/native';
import React from 'react';
import {
  APPLY_ACTIVATION_CHECK,
  APPLY_APPL_NODE_QUERY,
} from 'src/constants/actions';
import { getStoreDispatch, getStoreState } from 'src/store';
import { USER_APPLY_NODE_MAP, INDEX_HOME } from 'src/constants/urls';
import { loadingOne, close, infoOne } from 'src/components/modal/toast';
import { IS_MOCK } from 'src/constants/envs';
import { DEFAULT_PRODUCT_CODE } from 'src/constants/index/default';
import { getModalList } from 'src/components/modal/popup';
import history, { setBack } from '../../utils/init/history';
import { oneConfirm, oneError } from '../../components/modal/confirm';
import { post } from '../../utils/fetch';
import {
  API_USER_APPLY_NODE_QUERY,
  API_COMMON_MULTIFILE_UPLOAD,
  API_USER_APPLY_ACTIVATION_CHECK,
  API_USER_APPLY_ITEM_ACTIVATION,
  API_USER_APPLY_ITEM_COMMIT,
} from '../../constants/apis';
import Env from '../../constants/envs';
import { warnLog } from '../../utils/extend';

export const upLoadImage = async (fileMap = [], bizType = '') => {
  if (IS_MOCK) {
    return {
      fileNameCodes: {
        pan_image: 'test_pan_image',
        aadhaar_front_image: 'test_aadhaar_front_image',
        aadhaar_rear_image: 'test_aadhaar_rear_image',
        face_image: 'test_face_image',
      },

    };
  }
  return await post(API_COMMON_MULTIFILE_UPLOAD, {
    fileSuffix: 'jpg',
    fileMap,
    bizType,
  });
};

// pan Ocr 识别
export const panOcr = async (data) => {
  const {
    appId, appKey, invokeType, callBackUrl = '',
  } = data;
  const rst = await panCardOCR({
    appId,
    appKey,
    busiType: invokeType,
    callbackUrl: callBackUrl,
  });
  return rst;
};

// addhaar 识别
export const addhaarOcr = async (data) => {
  const {
    appId = '', appKey = '', invokeType = '', callBackUrl = '',
  } = data;
  const rst = await aadhaarOCR({
    appId,
    appKey,
    busiType: invokeType,
    callbackUrl: callBackUrl,
  });
  return rst;
};

// face 人脸识别
export const face = async (params = {}, eventParams = {}) => {
  const {
    appId, appKey, invokeType = '', callBackUrl = '',
  } = params;
  const { eventId = '', type = '' } = eventParams;
  const firstTime = new Date().getTime();
  const rst = await livenessRecognition({
    appId,
    busiType: invokeType,
    appKey,
    callbackUrl: callBackUrl,
  });
  const secondesTime = new Date().getTime();
  try {
    onEvent(eventId, {
      Camera: '允许',
      operationTime: ((secondesTime - firstTime) / 1000).toFixed(0),
      result: !rst.ERROR_TAG ? '成功' : '失败',
      failReason: !rst.ERROR_TAG ? '' : rst.msg,
      entrance: type,
    });
  } catch (e) {
    warnLog(e);
  }
  if (rst.flag === 'C') return null;
  if (rst && rst.ERROR_TAG) {
    const { msg = '', data = {} } = rst;
    const scanResult = JSON.parse(data.scanResult || '{}');
    infoOne(scanResult.comment || msg);
    return null;
  } 
  let { imageMap = '{}' } = rst;
  imageMap = JSON.parse(imageMap);
  const rstImage = await upLoadImage([
    { fileKey: 'image_action1', fileId: imageMap.fileAction1 },
    { fileKey: 'image_action2', fileId: imageMap.fileAction2 },
  ], 'FACE');

  if (!rstImage) {
    return null;
  }
  const { fileNameCodes } = rstImage;
  const faceImage = [];
  Object.keys(fileNameCodes).forEach((item) => {
    faceImage.push(fileNameCodes[item]);
  });
  const scanResult = JSON.parse(rst.scanResult || '{}');
  const param = {
    reportId: scanResult.report_id,
    faceImage: faceImage.join('|'),
    faceData: rst.scanResult,
  };
  return param;
};

// 设置交易密码
export const settingTradPwd = async (nodeStepInfo, segmentInfo = { passwordKey: 'password' }, bak = () => {}) => {
  const {
    flowNo, applNo, nodeNo, nodeCode,
  } = nodeStepInfo;
  const rst = await settingTradersPwd({
    type: 1,
    businessParams: {
      ...{
        flowNo, applNo, productCode: DEFAULT_PRODUCT_CODE, nodeNo, nodeCode,
      },
      segmentInfo,
    },
    method: API_USER_APPLY_ITEM_COMMIT,
    requestUrl: Env.URL,
  });
  if (rst) {
    const {
      flag, data = {}, ERROR_TAG, msg = '',
    } = rst;
    const { location } = history;
    const { pathname } = location;
    if (ERROR_TAG || flag !== 'S') {
      close();
      if (pathname !== INDEX_HOME) {
        setBack(null);
        history.goBack({
          path: INDEX_HOME,
        });
      }
      if (msg) {
        setTimeout(() => {
          infoOne(msg);
        }, 100);
      }
      return;
    }
    setNodeInfo(data);
    const { nodeGivenCode, nextNodeCode, thirdServiceInfo = {} } = data;
    if (nodeGivenCode === 'TIME_OUT_SET_PAD') {
      close();
      if (pathname !== INDEX_HOME) {
        oneError({
          msg: (<div className="t-center">The interval between the completion of transaction password and face recognition shall not exceed 12 hours.</div>),
          okText: 'Face Recognition again',
          ok: () => {
            bak({ paramThirdInfo: { ...thirdServiceInfo } });
          },
        });
      }
    } else {
      setTimeout(() => {
        close();
        history.push(USER_APPLY_NODE_MAP[nextNodeCode]);
      }, 500);
    }
  }


  return rst;
};

// 获取额外信息
export const getExtraInfo = async (option = {}) => {
  const { contactList = true, appList = true } = option;
  const fileMap = [];
  if (contactList) {
    const contactsInfo = await getContactsInfo({ limit: '0' });
    if (!contactsInfo || contactsInfo.ERROR_TAG) {
      return null;
    }
    fileMap.push({ fileKey: 'contactList', fileId: contactsInfo.fileId });
  }
  if (appList) {
    const appRst = await getInstalledApps();
    if (!appRst || appRst.ERROR_TAG) {
      return null;
    }
    fileMap.push({ fileKey: 'appList', fileId: appRst.fileId });
  }
  return fileMap;
};

// 挽留弹框1
export const onBackOne = (options = {}) => {
  const {
    title = (<img className="height100 width100 ilbl" src={require('./images/smile.png')} alt="" />),
    msg = (
      <div>
        <p className=" font36 rmed fw1 fcolor1 t-center ">Give up the loan of up to &#x20B9;1 Lakh? </p>
        <p className="font28 fcolor1 t-center">Only a few more steps left to get your loan</p>
      </div>
    ),
    cancelText = 'Yes, give up',
    okText = 'Back to apply',
    cancel = () => {
      history.goBack({
        path: INDEX_HOME,
      });
    },
    eventId = '',
    resourcePage = '',
  } = options;
  let isShowConfirm = null;
  setBack(() => {
    const pop = getModalList();
    if (pop) {
      pop();
      return;
    }
    if (isShowConfirm) {
      isShowConfirm();
      setBack(null);
      setTimeout(() => {
        cancel();
      }, 0);
      return;
    }
    onEvent('1301', {
      resourcePage,
    });
    isShowConfirm = oneConfirm({
      title,
      msg,
      cancelText,
      okText,
      end: () => {
        isShowConfirm = null;
      },
      ok: () => {
        onEvent('1303');
      },
      cancel: () => {
        onEvent('1302');
        setBack(null);
        cancel();
        onEvent(eventId);
      },
    });
  });
};
// 错误弹窗图片提示
export function showTips(option = {}) {
  const { msg, okText = 'Re-scan', ocr } = option;
  oneError({
    msg: <p className="font28 fcolor1 t-center ell" style={{ maxHeight: '6rem', whiteSpace: 'normal' }}>{msg}</p>,
    okText,
    ok: () => {
      ocr();
    },
  });
}
// 设置当前节点信息
export function setNodeInfo(nodeInfo) {
  const { apply } = getStoreState();
  const { nodeStepInfo = {} } = apply;
  const { nextNodeNo = null, nextNodeCode = null } = nodeInfo;
  if (nextNodeNo) nodeStepInfo.nodeNo = nextNodeNo;
  if (nextNodeCode) nodeStepInfo.nodeCode = nextNodeCode;

  getStoreDispatch({
    type: APPLY_APPL_NODE_QUERY,
    data: { ...nodeStepInfo, ...nodeInfo },
  });
}

// 去授信
export const toApply = async (options) => {
  loadingOne();
  const { pwdCall } = options;
  const nodeInfo = await post(API_USER_APPLY_NODE_QUERY, {
    productCode: DEFAULT_PRODUCT_CODE,
  });
  if (!nodeInfo) {
    close();
    return;
  }
  setNodeInfo(nodeInfo);
  const { nodeCode = '', panInfo = {} } = nodeInfo;
  let nodePage = USER_APPLY_NODE_MAP[nodeCode];
  if (panInfo && panInfo.panFlag === 'W' && nodeCode === 'PAN') nodePage = USER_APPLY_NODE_MAP.PAN_RESULT;
  if (nodeCode === 'PASSWORD') {
    await settingTradPwd(nodeInfo, { passwordKey: 'password' }, pwdCall);
    setTimeout(() => {
      close();
    });
    return;
  }
  onEvent('0202', { stateId: true });
  history.push(nodePage);
};

// 二次授信前检查
export const applyActivationCheck = async () => {
  loadingOne();
  const rst = await post(API_USER_APPLY_ACTIVATION_CHECK, {
    productCode: DEFAULT_PRODUCT_CODE,
  });
  getStoreDispatch({
    type: APPLY_ACTIVATION_CHECK,
    data: rst || {},
  });
  close();
  return rst;
};


// 二次授信
export const applyActivation = async (option) => {
  const { crawlFalg = 'N' } = option;
  const param = {
    productCode: DEFAULT_PRODUCT_CODE,
  };
  const addressInfo = await getAddressInfo({
    realTime: 'Y',
    isMust: 'Y',
  });
  if (!addressInfo || addressInfo.ERROR_TAG) {
    close();
    return;
  }
  param.geoInfo = JSON.stringify(addressInfo);
  if (crawlFalg === 'Y') {
    const fileMap = await getExtraInfo();
    param.fileMap = fileMap;
  }

  const rst = await verTradersPwd({
    title: '请输入交易密码',
    subTitle: '确认借款',
    businessParams: param,
    method: API_USER_APPLY_ITEM_ACTIVATION,
    field: 'password',
    requestUrl: Env.URL,
  });
  try {
    onEvent('1402', {
      GPS: !addressInfo.ERROR_TAG ? '允许' : '拒绝',
      device: '允许',
      result: !rst.ERROR_TAG ? '成功' : '失败',
      failReason: !rst.ERROR_TAG ? '' : rst.msg,
    });
  } catch (e) {
    warnLog(e);
  }
  return rst;
};

// 参数加密
export const paramsNativeRsa = async (params) => {
  const data = await getRSAEncodeString({
    params,
  });
  return data.params;
};
