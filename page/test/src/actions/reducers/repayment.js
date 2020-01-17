/**
 * 还款
 * @author Xiaolong
 */
import {
  GET_TRADE_REFUND_TRIAL,
} from 'src/constants/actions';

const trailInfo = {};

function repayment(state = {
  trailInfo,
}, action) {
  const { type, data = {} } = action;
  switch (type) {
    case GET_TRADE_REFUND_TRIAL:
      return { ...state, ...{ trailInfo: data } };
    default:
      return state;
  }
}

export default repayment;
