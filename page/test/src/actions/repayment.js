/**
 * 还款
 * @author Xiaolong
 */
import {
  GET_TRADE_REFUND_TRIAL,
} from 'src/constants/actions';
import {
  API_TRADE_REFUND_TRIAL,
} from 'src/constants/apis';
import { getStoreDispatch } from 'src/store';
import { post } from '../utils/fetch';

const sdkThirdPayNameList = ['razorpay'];

// 还款试算
export const repayTrail = async (param) => {
  param.sdkThirdPayNameList = sdkThirdPayNameList;
  const rst = await post(API_TRADE_REFUND_TRIAL, param);
  if (rst) {
    getStoreDispatch({
      type: GET_TRADE_REFUND_TRIAL,
      data: { ...param, ...rst },
    });
  }

  return rst;
};

export default {};
