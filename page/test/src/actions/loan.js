/**
 * 借款
 * @author Xiaolong
 */
import {
  GET_LOAN_PRE_CHECK_INFO,
  SET_LOAN_TRADE_DRAW_INFO,
  SET_LOAN_TRADE_LAON_SUBMIT,
  GET_LOAN_LIST_INFO,
  GET_LOAN_DETAIL_INFO,
  GET_USER_CARD_INFO_QUERY,
  SET_LOAN_COMMIT_DATA_INFO,
} from 'src/constants/actions';
import { post } from 'src/utils/fetch';
import {
  API_LOAN_PRE_CHECK,
  API_LOAN_TRADE_DRAW_TRIAL,
  API_LOAN_TRADE_LAON_LIST_QUERY,
  API_LOAN_TRADE_LAON_INFO_QUERY,
  API_LOAN_TRADE_LAON_FACE_SUBMIT,
} from 'src/constants/apis';

// 借款前检查
export const userLoanPreCheck = param => async (dispatch) => {
  const rst = await post(API_LOAN_PRE_CHECK, param);
  dispatch({
    type: GET_LOAN_PRE_CHECK_INFO,
    data: rst || {},
  });
  dispatch({
    type: GET_USER_CARD_INFO_QUERY,
    data: (rst && rst.loanCards) || [],
  });
  return rst;
};

// 借款前检查
export const setLoanData = (data = {}) => ({
  type: SET_LOAN_COMMIT_DATA_INFO,
  data,
});

// 试算
export const userLoanTrail = param => async (dispatch) => {
  const rst = await post(API_LOAN_TRADE_DRAW_TRIAL, param);
  dispatch({
    type: SET_LOAN_TRADE_DRAW_INFO,
    data: rst || {},
  });
  dispatch(setLoanData(param));
  return rst;
};

// 借款提交
export const userLoanSubmit = (data = {}) => ({
  type: SET_LOAN_TRADE_LAON_SUBMIT,
  data,
});
// 借款人脸提交
export const loanFaceSubmit = param => async (dispatch) => {
  const rst = await post(API_LOAN_TRADE_LAON_FACE_SUBMIT, param);
  dispatch({
    type: SET_LOAN_TRADE_LAON_SUBMIT,
    data: rst,
  });
  return rst;
};

// 获取借款列表
export const getUserLoanListInfo = param => async (dispatch) => {
  const rst = await post(API_LOAN_TRADE_LAON_LIST_QUERY, param);
  dispatch({
    type: GET_LOAN_LIST_INFO,
    data: rst || [],
  });
  return rst;
};

// 获取借款详情
export const getUserListDetail = param => async (dispatch) => {
  const rst = await post(API_LOAN_TRADE_LAON_INFO_QUERY, param);
  dispatch({
    type: GET_LOAN_DETAIL_INFO,
    data: rst || {},
  });
  return rst;
};


export default {};
