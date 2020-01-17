/**
 * help
 * @author xiaolong
 */
import React, { Fragment, lazy } from 'react';
import { Route } from 'react-router-dom';
import Load from 'src/components/util/loadLazyPage';

const Detail = lazy(() => import('./detail'));
const Index = lazy(() => import('./index/index.jsx'));

class Main extends React.Component {
  render() {
    const { match } = this.props;
    return (
      <Fragment>
        <Route exact path={`${match.url}/index`} render={props => <Load><Index {...props} /></Load>} />
        <Route exact path={`${match.url}/detail/:id`} render={props => <Load><Detail {...props} /></Load>} />
      </Fragment>
    );
  }
}

export default Main;
