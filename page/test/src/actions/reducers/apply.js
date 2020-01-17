import {
  APPLY_APPL_NODE_QUERY,
  APPLY_ACTIVATION_CHECK,
} from 'src/constants/actions';
import createInfo from './reducerUtil';

const nodeStepInfo = createInfo('apply_nodeStepInfo', {});
const activationInfo = {};

function Info(state = {
  nodeStepInfo,
  activationInfo,
}, action) {
  const { type, data } = action;
  switch (type) {
    case APPLY_APPL_NODE_QUERY:
      return { ...state, ...{ nodeStepInfo: { ...state.nodeStepInfo, ...data } } };
    case APPLY_ACTIVATION_CHECK:
      return { ...state, ...{ activationInfo: { ...state.activationInfo, ...data } } };
    default:
      return state;
  }
}

export default Info;
