/**
 * 360loan-india 借款
 * @author Xiaolong
 */
import React, { Fragment, lazy } from 'react';
import { Route } from 'react-router-dom';
import Load from 'src/components/util/loadLazyPage';

const Bank = lazy(() => import('./bank'));

class Main extends React.Component {
  render() {
    const { match } = this.props;
    return (
      <Fragment>
        <Route exact path={`${match.url}/bank`} render={props => <Load><Bank {...props} /></Load>} />
      </Fragment>
    );
  }
}
export default Main;
