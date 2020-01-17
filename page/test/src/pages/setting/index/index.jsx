/**
 * 设置
 * @author xiaolong
 */
import React, { Fragment, lazy } from 'react';
import { Route } from 'react-router-dom';
import Load from 'src/components/util/loadLazyPage';

const ResetPwd = lazy(() => import('./reset_psw'));
const Index = lazy(() => import('./index/index.jsx'));

class Main extends React.Component {
  render() {
    const { match } = this.props;
    return (
      <Fragment>
        <Route exact path={`${match.url}/reset_psw`} render={props => <Load><ResetPwd {...props} /></Load>} />
        <Route exact path={`${match.url}/index`} render={props => <Load><Index {...props} /></Load>} />
      </Fragment>
    );
  }
}

export default Main;
