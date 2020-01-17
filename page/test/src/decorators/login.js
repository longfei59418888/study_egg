/**
 * 是否需要登录
 * @author Xiaolong
 */
import React from 'react';
import { isLogin } from 'src/utils/common';
import history from 'src/utils/init/history';
import { LOGIN_INDEX } from 'src/constants/urls';
import { getThrottle } from '../utils/extend';

export default function login(loginPathType = 2) {
  const routers = history.routerList;
  const loginPath = routers[routers.length - 2];
  const loginToPath = routers[routers.length - 1];
  const throttle = getThrottle(500);
  return function (target) {
    const { componentWillMount, render } = target.prototype;
    target.prototype.componentWillMount = function () {
      if (!isLogin() && !throttle()) {
        setTimeout(() => {
          history.replace(LOGIN_INDEX, {
            toLogin: 1,
            loginPath,
            loginToPath,
            loginPathType,
          });
        }, 0);
      }
      return componentWillMount.apply(this);
    };
    target.prototype.render = function () {
      if (!isLogin()) {
        return <div />;
      }
      return render.apply(this);
    };
  };
}
