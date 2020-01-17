/**
 * 借款的处理方法
 * @author Xiaolong
 */
import { verTradersPwd } from 'src/utils/native';
import { API_LOAN_TRADE_LOAN_SUBMIT } from 'src/constants/apis';
import Env, { IS_MOCK } from 'src/constants/envs';
import { post } from 'src/utils/fetch';
import { getStoreDispatch } from '../../store';
import { LOAN_INFO_TO_CONFIRM } from '../../constants/actions';

export const verifyTradersPwd = async (param) => {
  if (IS_MOCK) {
    return await post(API_LOAN_TRADE_LOAN_SUBMIT);
  }
  const {
    title = '请输入交易密码',
    subTitle = '确认借款',
    businessParams = {},
    method = API_LOAN_TRADE_LOAN_SUBMIT,
    field = 'transPwd',
    amount,
  } = param;
  const rst = await verTradersPwd({
    title,
    subTitle,
    method,
    businessParams,
    field,
    amount,
    requestUrl: Env.URL,
  });
  return rst;
};
export const loanInfoToConfirm = (data) => {
  getStoreDispatch({
    type: LOAN_INFO_TO_CONFIRM,
    data: data || {},
  });
};
