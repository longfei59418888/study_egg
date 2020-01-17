/**
 * pay
 * @author Xiaolong
 */
import { openPayment } from 'src/utils/native';
import { infoOne } from 'src/components/modal/toast';
import { post } from 'src/utils/fetch';
import { API_TRADE_REFUND_SUBMIT } from 'src/constants/apis';
import { getStoreDispatch } from '../../store';
import {
  CHOICE_LOAN_RECORD, GET_AGREEMENT_NO, GET_LOAN_DETAIL_INFO, GET_LOAN_LIST_INFO, 
} from '../../constants/actions';
import history from '../../utils/init/history';
import { AGREEMENT_NO_INFO, REPAY_RECORD_DETAIL } from '../../constants/urls';

export const payment = async (params) => {
  const rst = await openPayment(params);
  if (rst) {
    const { ERROR_TAG, data = {}, msg } = rst;
    const { codeInt } = data;
    if (ERROR_TAG) {
      if (codeInt === 0) {
        infoOne(msg);
      } else {
        try {
          const { description } = JSON.parse(msg);
          infoOne(description);
        } catch (e) {
          infoOne(msg);
        }
        return 2;
      }
    } else {
      infoOne('pay success');
      return 1;
    }
  }
  return 0;
};


export const pay = async (params) => {
  const rstData = await post(API_TRADE_REFUND_SUBMIT, params);
  const {
    thirdPayName, orderInfo = {},
  } = rstData;
  const {
    mcName, orderDesc, orderNo, currency, amount, pamentKey,
  } = orderInfo;
  const test = {
    sdkType: thirdPayName,
    orderInfo: {
      mcName,
      orderDesc,
      orderId: orderNo,
      currency,
      amount,
    },
    pamentKey,
  };
  const rst = await payment(test);
  return rst;
};

export const getAgreementNo = (param) => {
  getStoreDispatch({
    type: GET_AGREEMENT_NO,
    data: param.agreementNo || {},
  });
  history.push(AGREEMENT_NO_INFO);
};

export const choiceRecord = (args) => {
  const { loanReqNo, contractNo } = args;
  const rst = {
    loanReqNo,
    contractNo,
  };
  getStoreDispatch({
    type: CHOICE_LOAN_RECORD,
    data: rst || {},
  });
  history.push(REPAY_RECORD_DETAIL);
};

export const clearLoanRecord = () => {
  getStoreDispatch({
    type: GET_LOAN_DETAIL_INFO,
    data: {},
  });
};

export const clearLoanList = () => {
  getStoreDispatch({
    type: GET_LOAN_LIST_INFO,
    data: [],
  });
};
