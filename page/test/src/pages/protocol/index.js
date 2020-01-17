/**
 * 相关协议
 * @author luxun
 */
import React, { Fragment, lazy } from 'react';
import { Route } from 'react-router-dom';
import Load from 'src/components/util/loadLazyPage';

const Loan = lazy(() => import('./loan'));
const Apply = lazy(() => import('./apply'));
const Model = lazy(() => import('./model'));

class Main extends React.Component {
  render() {
    const { match } = this.props;
    return (
      <Fragment>
        <Route exact path={`${match.url}/loan`} render={props => <Load><Loan {...props} /></Load>} />
        <Route exact path={`${match.url}/apply`} render={props => <Load><Apply {...props} /></Load>} />
        <Route exact path={`${match.url}/model`} render={props => <Load><Model {...props} /></Load>} />
      </Fragment>
    );
  }
}

export default Main;
