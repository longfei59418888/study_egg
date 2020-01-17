/**
 * 全局变量
 * @author Xiaolong
 */

const { location } = window;
export const ua = navigator.userAgent.toUpperCase();
// 当前环境是否为Android平台
export const IS_ANDROID = ua.indexOf('ANDROID') !== -1;
// 当前环境是否为IOS平台
export const IS_IOS = ua.indexOf('IPHONE OS') !== -1;
// 是否在APP内
export const IS_LOCAL = (location.hostname === 'localhost') || (location.hostname.indexOf('10.94') > -1) || (location.hostname.indexOf('127.0.0.1') > -1);
export const IS_APP = IS_IOS;
export const IS_PROD = __ENV__ === 'production';
export const PROD_VERSION = __VERSION__;

export const IS_MOCK = PROD_VERSION === '0' && false;


export const H5_DEFAULT_COMMON_INFO = {
  version: '1.0.0',
  channelSource: 'CH_00001',
  sourceType: 'APKKR',
  hostApp: '360LOAN_IN',
  timestamp: '1562552148621',
  deviceInfo: '{"terminalType":"app","deviceSn":"352936090802058","deviceOs":"ANDROID","deviceOsVersion":"8.0.0","deviceOsVerIntStr":"26","deviceIp":"10.94.40.56","imsi":"","isRoot":"N","isEmulator":"N","networkType":"WIFI","wifiMac":"8c:45:00:b7:84:06","wifiName":"360JR-TEST","brand":"samsung","model":"SM-G9650","usedStorage":"21954822144","totalStorage":"56733442048","factoryTime":"1541587483000","deviceName":"SM-G9650","deviceFingerPrintM2":"63cab4ed64f0bd044f0877cfdd59dcfc","deviceFingerPrintTd":"","deviceFingerPrintBr":"","uuid":"00000000-1b1d-3a69-6241-a3940033c587","buildSerial":"3555434e59533098","bssid":"44:1a:fa:31:70:c1","isYUNOS":"N","androidId":"cad12563200cb0dc","blackBox":"661852B17AAC2884E709CC439C5470D0883F4635A77EEA15AA1D98E028ADFF20A70194910F3456692CA0D127147E867CD6036F54E86E588A2730009E4965DF1D7D354656BCA5B0D52C443BCB21CB7A9887C1F75445E22CFE5A4DCED400C7448292F4DDB3C17899D157459B252AB3AD653232B7B3ADB704CCF0A7BBBE75C6F44EAA3E32DA018FBFF1C74FEA261B7DCD33AB8713943409E648B5756F97D1CDDFFF36CD7722D449A833A75703942D31AFB4A62EDF5CBE5BBDA5439A8881E9CAF684FBEFFE224E9A2BC6CD499CE9200FD79B4D2540A4843258BDBBFD30F8134EB6DA20CDE31BDABD0F4CAA9647ACAECFCFF967018DE3CE09B92620912DB3B310A32A","qdasM2":"868af1047bf4e16446b66ae38dee7621"}',
  appVersion: '1.0.0',
  h5Version: '1010100001',
  // productCode: '360LOAN_IN',
};
export const MOCK_URL = 'http://360jie.com.cn:3033/';


let URL = 'http://10.94.90.57:8080/api/gateway.do';

// const URL = 'http://lps-web-stg.your360loans.in/api/gateway.do';
if (__VERSION__ !== '0') {
  URL = 'https://loan.your360loans.com/api/gateway.do';
  if (__ENV__ === 'STG2') {
    URL = 'http://10.94.90.57:8080/api/gateway.do';
  } else if (__ENV__ === 'UAT') {
    URL = 'http://lps-web-stg.your360loans.in/api/gateway.do';
  }
}


export default {
  URL,
};
