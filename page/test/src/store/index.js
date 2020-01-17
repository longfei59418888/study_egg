/**
 * store
 * @author Xiaolong
 */
import { applyMiddleware, compose, createStore } from 'redux';
import { createLogger } from 'redux-logger';
import promise from 'redux-promise';
import thunk from 'redux-thunk';
import { isObject } from 'src/utils/extend';
import Storage from 'xl_storage';
import { USER_INFO_STORE_NUMBER, USER_INFO_REDUCER_NAME } from 'src/constants/index/default';
import reducers from '../actions/reducers';

const test = true;

const nextReducers = require('../actions/reducers');

const ENV = process.env.NODE_ENV;

const configureStore = (initialState = {}) => {
  const logger = createLogger();
  let enhancer;
  if (ENV === 'production' || test) {
    enhancer = compose(applyMiddleware(thunk, promise));
  } else {
    enhancer = compose(applyMiddleware(thunk, promise, logger));
  }

  const store = createStore(reducers, initialState, enhancer);

  if (ENV !== 'production' && module.hot && module.hot.active) {
    module.hot.accept('../actions/reducers', () => {
      store.replaceReducer(nextReducers);
    });
  }
  return store;
};
const store = configureStore();

const getAllStateInfo = (state, infoList = {}, name = '') => {
  if (name !== '') name += '_';
  Object.keys(state).forEach((item) => {
    const info = state[item];
    if (isObject(info)) {
      if (info.IS_STORE) infoList[`${name}${item}`] = info;
      else getAllStateInfo(info, infoList, `${name}${item}`);
    }
  });
  return infoList;
};

const storeStorage = new Storage(USER_INFO_REDUCER_NAME);
store.subscribe(() => {
  const state = store.getState();
  const infoList = getAllStateInfo(state);
  // const userNo = null || USER_INFO_STORE_NUMBER;
  // const oldUser = storeStorage.get(USER_INFO_STORE_NUMBER_TIP);
  // storeStorage.set(USER_INFO_STORE_NUMBER_TIP, userNo);
  // if (oldUser && oldUser !== userNo) storeStorage.remove(oldUser);
  storeStorage.set(USER_INFO_STORE_NUMBER, infoList);
});

export function getStoreState() {
  return store.getState();
}

export function getStoreDispatch(action) {
  return store.dispatch(action);
}

export default store;
