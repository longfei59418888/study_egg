/**
 * 360loan-india 借款
 * @author Xiaolong
 */
import React, { Fragment, lazy } from 'react';
import { Route } from 'react-router-dom';
import Load from 'src/components/util/loadLazyPage';

const RecordList = lazy(() => import('./record_list'));
const Index = lazy(() => import('./index/index.jsx'));
const RecordDetail = lazy(() => import('./record_detail'));
const Result = lazy(() => import('./result'));

class Home extends React.Component {
  render() {
    const { match } = this.props;
    return (
      <Fragment>
        <Route exact path={`${match.url}/record_list`} render={props => <Load style={{ background: 'rgba(245,245,245,1)' }}><RecordList {...props} /></Load>} />
        <Route exact path={`${match.url}/index`} render={props => <Load style={{ background: 'rgba(245,245,245,1)' }}><Index {...props} /></Load>} />
        <Route exact path={`${match.url}/result/:type`} render={props => <Load><Result {...props} /></Load>} />
        <Route exact path={`${match.url}/record_detail`} render={props => <Load style={{ background: 'rgba(245,245,245,1)' }}><RecordDetail {...props} /></Load>} />
      </Fragment>
    );
  }
}
export default Home;
