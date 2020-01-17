import {
  SET_GLOBAL_PAGE_SLIDE_CLASS,
  SET_GLOBAL_HEADER_INFO,
  SET_GLOBAL_INDEX_TAB_INFO,
} from 'src/constants/actions';

// 页面切换效果
export const setPageSlideClass = data => ({
  type: SET_GLOBAL_PAGE_SLIDE_CLASS,
  data,
});

export const setGlobalHeaderInfo = data => ({
  type: SET_GLOBAL_HEADER_INFO,
  data,
});

export const setIndexTab = data => ({
  type: SET_GLOBAL_INDEX_TAB_INFO,
  data,
});
