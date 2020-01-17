/**
 * 360loan-india 授信
 * @author Xiaolong
 */
import React, { Fragment, lazy } from 'react';
import { Route } from 'react-router-dom';
import Load from 'src/components/util/loadLazyPage';

const Pan = lazy(() => import('./pan'));
const Aadhaar = lazy(() => import('./aadhaar'));
const Face = lazy(() => import('./face'));
const Result = lazy(() => import('./result'));
const Profile = lazy(() => import('./profile'));
const PanResult = lazy(() => import('./pan_result'));

class Main extends React.Component {
  render() {
    const { match } = this.props;
    return (
      <Fragment>
        <Route exact path={`${match.url}/aadhaar`} render={props => <Load><Aadhaar {...props} /></Load>} />
        <Route exact path={`${match.url}/face`} render={props => <Load><Face {...props} /></Load>} />
        <Route exact path={`${match.url}/result`} render={props => <Load><Result {...props} /></Load>} />
        <Route exact path={`${match.url}/pan`} render={props => <Load><Pan {...props} /></Load>} />
        <Route exact path={`${match.url}/profile`} render={props => <Load><Profile {...props} /></Load>} />
        <Route exact path={`${match.url}/pan_result`} render={props => <Load><PanResult {...props} /></Load>} />
      </Fragment>
    );
  }
}
export default Main;
