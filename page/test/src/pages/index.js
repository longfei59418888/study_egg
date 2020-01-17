/**
 * 360loan-india 入口
 * @author Xiaolong
 */
import React from 'react';
import { Route } from 'react-router-dom';
// import AnimatedRouter from 'src/components/animatedRouter';
import Index from './index/index';
import Login from './login';


class Home extends React.Component {
  render() {
    return (
      <div>
        {/*<AnimatedRouter>*/}
          <Route path="/index" component={Index} />
          <Route path="/login" component={Login} />
        {/*</AnimatedRouter>*/}
      </div>
    );
  }
}

export default Home;

// native 接口对接
// native 动画效果测试
// native 自动发布对接
