/**
 * 页面初始化
 * @author Xiaolong
 */
import { interceptBackPressEvent } from '../native';

// 全局是样式
let topPad = 0;


const init = async () => {
  // 拦截物理返回事件
  await interceptBackPressEvent({
    intercept: 'Y',
  });
  topPad = 0;
};

export const getTop = () => `${topPad}px`;
export default init;
