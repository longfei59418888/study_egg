import {
  SET_GLOBAL_PAGE_SLIDE_CLASS,
  SET_GLOBAL_INDEX_TAB_INFO,
} from 'src/constants/actions';
// import createInfo from './reducerUtil';


// 页面切换效果
const PAGE_SLIDE_CLASS = {
  0: 'page-none',
  1: 'page-left',
  2: 'page-right',
};
// 首页tab状态
const indexTabInfo = {
  index: 1,
};


function global(state = {
  pageSlideClass: PAGE_SLIDE_CLASS[0],
  indexTabInfo,
}, action) {
  const { type, data } = action;
  switch (type) {
    case SET_GLOBAL_PAGE_SLIDE_CLASS:
      return { ...state, ...{ pageSlideClass: PAGE_SLIDE_CLASS[action.data] } };
    case SET_GLOBAL_INDEX_TAB_INFO:
      return { ...state, ...{ indexTabInfo: { ...state.indexTabInfo, ...data } } };
    default:
      return state;
  }
}

export default global;
