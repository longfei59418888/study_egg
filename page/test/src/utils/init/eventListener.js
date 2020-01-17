/**
 * native 事件监听
 * @author Xiaolong
 */

import { INDEX_HOME, INDEX_PERSONAL } from 'src/constants/urls';
import { infoOne } from 'src/components/modal/toast';
import Event from './event';
import history from './history';
import { back } from '../native';


const event = new Event();
if (!window.$$) window.$$ = {};
if (!window.$$.EventListener) window.$$.EventListener = {};

// 物理返回键事件
window.$$.EventListener.onBackPressed = () => event.trigger('pressBack');
export const pressBack = {
  on: (type, handler, context, isOne) => {
    type = `pressBack.${type}`;
    if (isOne) {
      event.once(type, handler, context);
    } else {
      event.on(type, handler, context);
    }
  },
  off: type => event.off(type),
};

let isOutApp = 2;
let loop = null;
pressBack.on('init', () => {
  const { location, goBack } = history;
  if (loop) clearTimeout(loop);
  if (location.pathname === INDEX_HOME || location.pathname === INDEX_PERSONAL) {
    isOutApp -= 1;
    if (isOutApp === 1) infoOne('Click again to exit');
    if (isOutApp === 0) back();
    loop = setTimeout(() => {
      isOutApp = 2;
    }, 2000);
    return;
  }
  goBack();
});


export default event;
