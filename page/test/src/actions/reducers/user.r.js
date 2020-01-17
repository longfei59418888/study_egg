import {
  USER_LOGIN_INFORM_SMS_SEND,
  GET_USER_INDEX_SUMMARY_INFO,
  CLEAR_USER_INDEX_SUMMARY_INFO,
  USER_MOBILE_LOGIN,
  USER_MOBILE_UNLOGIN,
  GET_USER_CARD_INFO_QUERY,
  GET_USER_PERSONAL_INFO,
} from 'src/constants/actions';
import createInfo, { clearStoreReducer } from './reducerUtil';

const userSmsLoginInfo = {
  sendInterval: 20,
  cdKey: '',
  mobileNo: '',
};

const userLoginInfo = createInfo('user_userLoginInfo', {
  token: '',
  userNo: '',
  mobileNo: '',
  rlflag: '',
});

const defaultCreditAmt = '1,00,000';
const InterestCreditAmt = '10,000';
const userIndexSummaryInfo = createInfo('user_userIndexSummaryInfo', {
  defaultCreditAmt,
  infromMsg: `Low as ₹5 daily interest for loan amount of ₹ ${InterestCreditAmt}`,
});

const userCardInfo = [];

function Info(state = {
  userSmsLoginInfo,
  userLoginInfo,
  userIndexSummaryInfo,
  userCardInfo,
}, action) {
  const { type, data = {} } = action;
  switch (type) {
    case USER_LOGIN_INFORM_SMS_SEND:
      return { ...state, ...{ userSmsLoginInfo: { ...state.userSmsLoginInfo, ...data } } };
    case GET_USER_INDEX_SUMMARY_INFO:
      return { ...state, ...{ userIndexSummaryInfo: { ...state.userIndexSummaryInfo, ...data } } };
    case CLEAR_USER_INDEX_SUMMARY_INFO:
      return {
        ...state,
        ...{
          userIndexSummaryInfo: clearStoreReducer({
            defaultCreditAmt,
            infromMsg: `Low as ₹5 daily interest for loan amount of ₹ ${InterestCreditAmt}`,
          }),
        },
      };
    case USER_MOBILE_LOGIN:
      return { ...state, ...{ userLoginInfo: { ...state.userLoginInfo, ...data } } };
    case USER_MOBILE_UNLOGIN:
      return {
        ...state,
        ...{
          userLoginInfo: clearStoreReducer({
            token: '',
            userNo: '',
            mobileNo: '',
            rlflag: '',
            smsCode: '',
          }),
          userIndexSummaryInfo: clearStoreReducer({
            defaultCreditAmt,
            infromMsg: `Low as ₹5 daily interest for loan amount of ₹ ${InterestCreditAmt}`,
          }), 
        }, 
      };
    case GET_USER_CARD_INFO_QUERY:
      return { ...state, ...{ userCardInfo: data } };
    case GET_USER_PERSONAL_INFO:
      return { ...state, ...{ userPersonalInfo: data } };
    default:
      return state;
  }
}

export default Info;
