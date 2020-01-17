/**
 * 借款数据
 * @author Xiaolong
 */
import {
  GET_LOAN_PRE_CHECK_INFO,
  SET_LOAN_TRADE_DRAW_INFO,
  SET_LOAN_TRADE_LAON_SUBMIT,
  GET_LOAN_LIST_INFO,
  GET_LOAN_DETAIL_INFO,
  SET_LOAN_COMMIT_DATA_INFO,
  CHOICE_LOAN_RECORD,
  LOAN_INFO_TO_CONFIRM,
  GET_AGREEMENT_NO,
} from 'src/constants/actions';
// import { isArray } from 'src/utils/extend';

const preCheckInfo = {};
const trailInfo = {};
const resultInfo = {};
const list = [];
const detail = {};
const info = {};
const choiceRecord = {};
const agreementNo = '';

function loan(state = {
  preCheckInfo,
  trailInfo,
  resultInfo,
  list,
  detail,
  info,
  choiceRecord,
  agreementNo,
}, action) {
  const { type, data = {} } = action;
  switch (type) {
    case GET_LOAN_PRE_CHECK_INFO:
      state.preCheckInfo = { ...state.preCheckInfo, ...data };
      return state;
    case SET_LOAN_COMMIT_DATA_INFO:
      state.info = { ...state.info, ...data };
      return state;
    case SET_LOAN_TRADE_DRAW_INFO:
      return { ...state, ...{ trailInfo: data } };
    case SET_LOAN_TRADE_LAON_SUBMIT:
      return { ...state, ...{ resultInfo: data } };
    case GET_LOAN_LIST_INFO:
      // if (!isArray(data)) return state;
      // state.list = data.concat(state.list);
      // return state;
      return { ...state, ...{ list: data } };
    case GET_LOAN_DETAIL_INFO:
      return { ...state, ...{ detail: data } };
    case CHOICE_LOAN_RECORD:
      return { ...state, ...{ choiceRecord: data } };
    case LOAN_INFO_TO_CONFIRM:
      return { ...state, ...{ loanInfoToConfrim: data } };
    case GET_AGREEMENT_NO:
      return { ...state, ...{ agreementNo: data } };
    default:
      return state;
  }
}

export default loan;
