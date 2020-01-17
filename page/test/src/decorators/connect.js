/**
 * redux的connect方法和组件连接
 * reduces   Array   state对象上的属性名称数组，用于绑定state数据到组件上
 * actions   Object  redux的actions
 * @author Xiaolong
 */
import { connect as connects } from 'react-redux';
import { bindActionCreators } from 'redux';


export default function connect(reduces, actions) {
  return function (target) {
    return connects((state) => {
      const stateProps = {};
      reduces.forEach((item) => {
        stateProps[item] = state[item];
      });
      return stateProps;
    }, dispatch => bindActionCreators(actions, dispatch))(target);
  };
}
