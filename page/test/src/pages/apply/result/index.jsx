/**
 * result
 * @author Xiaolong
 */
import React from 'react';

import Page from 'src/components/page';
import header from 'src/decorators/header';
import history, { setBack } from 'src/utils/init/history';
import Btn from 'src/components/form/btn';
import { INDEX_HOME } from 'src/constants/urls';
import { onEvent } from '../../../utils/native';


@header()
class Main extends React.Component {
  componentWillMount() {
    setBack(() => {
      setBack(null);
      history.goBack({
        path: INDEX_HOME,
      });
    });
  }
  componentDidMount() {
    onEvent('1201');
  }
  componentWillUnmount() {
    onEvent('1203');
  }

  render() {
    return (
      <Page className="pt16 pages-apply-pan-container">
        <div className="plr52">
          <p className="rbold font56 lh66 fcolor1 fw1 nowrap"><span>Application Submitted</span></p>
          <p className="mt30 fcolor3 flh42 font32 rreg">We will quickly evaluate your credit application. Once you get the approval of credit line, we will notify you immediately.</p>
        </div>
        <div className="mt100 t-center">
          <img className="ilbl" style={{ height: '1.44rem', width: '1.46rem' }} src={require('../images/waiting.png')} alt="" />
          <p className="fcolor14 lh52 sfbold fw1 font43 mt24">waiting…</p>
        </div>
        <div className="mt110 plr40">
          <Btn onClick={() => {
            onEvent('1202');
            history.goBack({
              path: INDEX_HOME,
            });
          }}>
            <span>Back to homepage</span>
          </Btn>
        </div>
      </Page>
    );
  }
}
export default Main;
