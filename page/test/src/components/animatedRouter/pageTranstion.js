/**
 * 路由加载器
 * @author Xiaolong
 */

import React from 'react';
import { Switch, withRouter } from 'react-router';
import Page from './page';


@withRouter
class Home extends React.Component {
  render() {
    const {
      location, children,
    } = this.props;
    const { pathname } = location;
    return (
      <div style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        left: 0,
        top: 0,
      }}>
        <Page>
          <div key={pathname}>
            <Switch location={location}>
              {children}
            </Switch>
          </div>
        </Page>
      </div>
    );
  }
}

export default Home;
