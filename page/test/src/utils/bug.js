/**
 * 错误上传
 * @author Xiaolong
 */
import FindBug from 'xl_findbug';
import { IS_PROD, PROD_VERSION, ua } from 'src/constants/envs';
import { errorLog } from './extend';
import { onEvent } from './native';

let bug = null;
let errorBug = false;
if (!IS_PROD) errorBug = false;

try {
  bug = new FindBug({
    version: PROD_VERSION,
    extra: {
      userAgent: ua,
    },
    upload: (parma) => {
      if (PROD_VERSION !== '0') {
        errorLog(parma);
        onEvent('4404', { errorBug: parma });
      }
    },
  });
} catch (e) {
  errorBug = true;
}

export const uploadError = (error, option = {}) => {
  if (errorBug) return;
  bug.captureExceptionReact(error, option);
};

export const addStack = (type, option = {}) => {
  if (errorBug) return;
  bug.addStack(type, option);
};

export const setExtra = (error, option = {}) => {
  if (errorBug) return;
  bug.setExtra(option);
};

export const addExtra = (error, option = {}) => {
  if (errorBug) return;
  option = { ...bug.extra, ...option };
  bug.setExtra(option);
};

export const setUser = (error, option = {}) => {
  if (errorBug) return;
  bug.setUser(option);
};
