/**
 * 360loan-india
 * @author luxun
 */
import { getStoreDispatch, getStoreState } from '../../store';
import { GET_USER_PERSONAL_INFO } from '../../constants/actions';

export const getUrlInfo = () => {
  const state = getStoreState();
  const { userLoginInfo } = state.user;
  const { userNo = '', mobileNo = '' } = userLoginInfo;
  const url = __ENV__ === 'STG2' ? `http://support.your360loans.in/?pkg=360LOAN_IN&appMobileNo=${mobileNo}&userNo=${userNo}&appChannel=app`
    : `https://support.your360loans.com/?pkg=360LOAN_IN&appMobileNo=${mobileNo}&userNo=${userNo}&appChannel=app`;
  return {
    url,
  };
};

export const clearUserInfo = async () => {
  getStoreDispatch({
    type: GET_USER_PERSONAL_INFO,
    data: {},
  });
};
