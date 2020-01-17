/**
 * 列表功能
 * @author luxun
*/
import React, { Fragment, lazy } from 'react';
import { Route } from 'react-router-dom';
import Load from 'src/components/util/loadLazyPage';

const Help = lazy(() => import('./help'));
const Legal = lazy(() => import('./legal_policies'));
const Profile = lazy(() => import('./profile'));
const Index = lazy(() => import('./index/index.jsx'));
const About = lazy(() => import('./about_us'));

class Main extends React.Component {
  render() {
    const { match } = this.props;
    return (
      <Fragment>
        <Route path={`${match.url}/help`} render={props => <Load><Help {...props} /></Load>} />
        <Route exact path={`${match.url}/profile`} render={props => <Load><Profile {...props} /></Load>} />
        <Route path={`${match.url}/legal_policies`} render={props => <Load><Legal {...props} /></Load>} />
        <Route exact path={`${match.url}/opinion`} render={props => <Load><Legal {...props} /></Load>} />
        <Route exact path={`${match.url}/about_us`} render={props => <Load><About {...props} /></Load>} />
        <Route path={`${match.url}/index`} render={props => <Load><Index {...props} /></Load>} />
      </Fragment>
    );
  }
}

export default Main;
