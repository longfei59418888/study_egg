/**
 * 360loan-india 借款
 * @author Xiaolong
 */
import React, { Fragment, lazy } from 'react';
import { Route } from 'react-router-dom';
import Load from 'src/components/util/loadLazyPage';

const Confirm = lazy(() => import('./confirm'));
const Index = lazy(() => import('./index/index.jsx'));
const Result = lazy(() => import('./result'));
const Add = lazy(() => import('./add'));

class Main extends React.Component {
  render() {
    const { match } = this.props;
    return (
      <Fragment>
        <Route exact path={`${match.url}/confirm`} render={props => <Load className="bgcolor11"><Confirm {...props} /></Load>} />
        <Route exact path={`${match.url}/index`} render={props => <Load className="bgcolor11"><Index {...props} /></Load>} />
        <Route exact path={`${match.url}/result`} render={props => <Load><Result {...props} /></Load>} />
        <Route path={`${match.url}/add`} render={props => <Load><Add {...props} /></Load>} />
      </Fragment>
    );
  }
}
export default Main;
