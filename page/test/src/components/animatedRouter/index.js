/**
 * 路由加载器
 * @author Xiaolong
 */
import React from 'react';
import { Switch, withRouter } from 'react-router';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { getStoreDispatch, getStoreState } from 'src/store';
import connect from 'src/decorators/connect';

import './index.scss';
import { SET_GLOBAL_PAGE_SLIDE_CLASS } from '../../constants/actions';

const mask = document.querySelector('#mask');
export const disableOption = () => {
  mask.style.display = 'block';
};
export const clearOption = () => {
  mask.style.display = 'none';
};


@withRouter
@connect(['global'], {})
class Home extends React.Component {
  render() {
    const {
      location, children,
    } = this.props;
    const { global } = getStoreState() || {};
    const { pathname } = location;
    const { pageSlideClass } = global;
    let timeout = 300;
    if (pageSlideClass === 'page-none') timeout = 0;
    return (
      <div style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
      }}>
        <TransitionGroup>
          <CSSTransition
            onEnter={() => {
              disableOption();
            }}
            onEntered={() => {
              getStoreDispatch({
                type: SET_GLOBAL_PAGE_SLIDE_CLASS,
                data: 0,
              });
              setTimeout(() => {
                clearOption();
              }, 400);
            }}
            key={pathname}
            unMountOnExit
            classNames={pageSlideClass}
            timeout={timeout}>
            <Switch location={location}>
              {children}
            </Switch>
          </CSSTransition>
        </TransitionGroup>
      </div>
    );
  }
}

// onEnter={() => {
//   console.log('enter_1');
// }}
// onEntering={() => {
//   console.log('enter_2');
// }}
// onEntered={() => {
//   console.log('enter_3');
// }}
// onExit={function (node) {
//     console.log(this);
//   }}
// onExiting={(node) => {
//   console.log(node);
//   console.error('exit_1');
// }}
// onExited={() => {
//   console.error('exit_3');
// }}

export default Home;
