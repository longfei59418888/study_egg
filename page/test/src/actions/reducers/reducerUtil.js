import Storage from 'xl_storage';

import { USER_INFO_STORE_NUMBER, USER_INFO_REDUCER_NAME } from 'src/constants/index/default';


const storeStorage = new Storage(USER_INFO_REDUCER_NAME);

const createStoreReducer = (name, data = {}) => {
  const infoList = storeStorage.get(USER_INFO_STORE_NUMBER);
  if (infoList && infoList[name]) return infoList[name];
  return { ...{ IS_STORE: true }, ...data };
};

export const clearStoreReducer = (data = {}) => ({ ...{ IS_STORE: true }, ...data });


export default createStoreReducer;
