/**
 * 防止重复调用
 * @param time 间隔时间
 * @author Xiaolong
 */
import history from 'src/utils/init/history';

export default function defaultProps() {
  return function (target) {
    const {
      location, goBack, initPage, push, 
    } = history;
    target.defaultProps = {
      ...{
        location,
        goBack,
        initPage,
        push,

      }, 
    };
  };
}
