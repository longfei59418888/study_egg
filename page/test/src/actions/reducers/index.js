/**
 * reducer 集合
 * @author Xiaolong
 */
import { combineReducers } from 'redux';
import apply from './apply';
import global from './global';
import loan from './loan';
import repayment from './repayment';

const reducerFiles = require.context('./', false, /\w+\.r\.js/);
const reducers = {};
reducerFiles.keys().forEach((fileName) => {
  // 获取组件配置
  const fileModule = reducerFiles(fileName);
  fileName = fileName.replace(/(\.\/)(\w+)\.r\.js/, '$2');
  if (fileName !== 'index') reducers[fileName] = fileModule.default;
});


export default combineReducers({
  ...reducers,
  ...{
    apply,
    loan,
    global,
    repayment,
  },
});
