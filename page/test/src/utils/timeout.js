/**
 * timeout加载器
 * @author Xiaolong
 */

const { setTimeout } = window;

const timeout = (callback, time) => {
  let loop = setTimeout(() => {
    callback();
    loop = null;
  }, time);
  return {
    loop,
    clear: () => {
      clearTimeout(loop);
      loop = null;
    },
  };
};

let pageOut = [];
export const clearPageTimeout = () => {
  pageOut.forEach((item) => {
    if (item) clearTimeout(item);
  });
  pageOut = [];
};
export const pageTimeout = (callback, time) => {
  let loop = setTimeout(() => {
    callback();
    loop = null;
  }, time);
  pageOut.push(loop);
  return {
    loop,
    clear: () => {
      clearTimeout(loop);
      loop = null;
    },
  };
};

export default timeout;
