// import {
//   APPLY_ITEM_COMMIT,
// } from 'src/constants/actions';
import {
  API_USER_APPLY_NODE_QUERY,
  API_USER_APPLY_ITEM_COMMIT,
  API_USER_APPLY_GET_PAN_RESULT,
} from 'src/constants/apis';
import { post } from 'src/utils/fetch';
import { DEFAULT_PRODUCT_CODE } from 'src/constants/index/default';


export const getUserApplyNodeQuery = async () => {
  const data = await post(API_USER_APPLY_NODE_QUERY);
  return data;
};

export const itemCommit = (data, deal = {}, other = {}) => async (dipatch, getState) => {
  const { apply = {} } = getState();
  const {
    flowNo, applNo, nodeNo, nodeCode,
  } = apply.nodeStepInfo;
  const rst = await post(API_USER_APPLY_ITEM_COMMIT, {
    ...{
      flowNo, applNo, productCode: DEFAULT_PRODUCT_CODE, nodeNo, nodeCode, segmentInfo: data,
    },
    ...other,
  }, deal);
  return rst;
};

export const getPanResult = async (reportId) => {
  const rst = await post(API_USER_APPLY_GET_PAN_RESULT, {
    reportId,
    productCode: DEFAULT_PRODUCT_CODE,
  });
  return rst;
};
