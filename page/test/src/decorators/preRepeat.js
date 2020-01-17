/**
 * 防止重复调用
 * @param time 间隔时间
 * @author Xiaolong
 */
import { getThrottle } from 'src/utils/extend';


function preRepeat(time = 500) {
  const throttle = getThrottle(time);
  return function (target, property, descriptor) {
    const oldValue = descriptor.value;
    descriptor.value = function () {
      if (throttle()) return;
      // 以属性的形式调用的时候，才会用 this，this.doing
      return oldValue.apply(this, arguments);
    };
    return descriptor;
  };
}

export default preRepeat;
