/**
 * 请求链接集合
 * @author Xiaolong
 */


export const INDEX_HOME = '/index/home'; // 首页
export const INDEX_PERSONAL = '/index/personal'; // 个人中心

export const LOGIN_INDEX = '/login/index'; // 登录
export const LOGIN_CONFIRM = '/login/confirm'; // 登录确认

export const APPLY_AADHAAR = '/apply/aadhaar';// 添加AADHAAR卡
export const APPLY_PAN_RESULT = '/apply/pan_result';// pan卡等待
export const APPLY_FACE = '/apply/face';// 人脸识别
export const APPLY_PAN = '/apply/pan';// 添加PAN卡
export const APPLY_PASSWORD = '/apply/password';// 添加密码
export const APPLY_PROFILE = '/apply/profile';// 认证材料
export const APPLY_RESULT = '/apply/result';// 认证结果

export const PROTOCOL_LOAN = '/protocol/loan';// 相关协议
export const PROTOCOL_APPLY = '/protocol/apply';// 相关协议

export const LOAN_INDEX = '/loan/index';// 借款
export const LOAN_ADD_BANK = '/loan/add/bank';// 添加VIA卡
export const LOAN_CONFIRM = '/loan/confirm';// 借款确认
export const LOAN_RECORD_LIST = '/loan/record_list';// 借款记录
export const LOAN_RESULT = '/loan/result';// 借款结果


export const REPAY_INDEX = '/repay/index';// 还款
export const REPAY_RESULT = '/repay/result';// 还款
export const REPAY_RECORD_DETAIL = '/repay/record_detail';// 还款记录细节
export const REPAY_RECORD_LIST = '/repay/record_list';// 还款记录清单
export const AGREEMENT_NO_INFO = '/protocol/model';// 还款记录清单

export const SETTING_INDEX = '/setting/index/index';// 设置
export const SETTING_INDEX_RESET_PSW = '/setting/index/reset_psw';// 修改密码人脸识别
export const SETTING_HELP_INDEX = '/setting/help/index';// 帮助
export const SETTING_HELP_DETAIL = '/setting/help/detail';// 帮助
export const SETTING_LEGAL_POLICIES_INDEX = '/setting/legal_policies/index';// 安全
export const SETTING_LEGAL_POLICIES_DETAIL = '/setting/legal_policies/detail';// 安全
export const SETTING_PROFILE = '/setting/profile';// 操作
export const SETTING_ABOUT_US = '/setting/about_us';// 关于我们


export const USER_APPLY_NODE_MAP = {
  PAN: APPLY_PAN,
  PAN_RESULT: APPLY_PAN_RESULT,
  AADHAAR: APPLY_AADHAAR,
  FACE: APPLY_FACE,
  PASSWORD: APPLY_PASSWORD,
  CONTACT: APPLY_PROFILE,
  RESULT: APPLY_RESULT,
};
