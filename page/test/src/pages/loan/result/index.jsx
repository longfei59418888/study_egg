import React from 'react';
import Page from 'src/components/page';
import Btn from 'src/components/form/btn';
import connect from 'src/decorators/connect';
import { INDEX_HOME } from 'src/constants/urls';
import header from '../../../decorators/header';
import { onEvent } from '../../../utils/native';

@connect(['loan'], {})
@header()
class Main extends React.Component {
  static _onBack='_onBack'
  componentDidMount() {
    onEvent('1901');
  }
  componentWillUnmount() {
    onEvent('1903');
  }

    _onBack = () => {
      const { history } = this.props;
      onEvent('1902');
      history.goBack({
        path: INDEX_HOME,
      });
    }
    render() {
      const { loan = {} } = this.props;
      const { informMsg, expectArrivalMsg } = loan.resultInfo;
      return (
        <Page className="plr40 pt48 ">
          <p className="rbold font56 fcolor1 fw1">Application Submitted</p>
          <p className="mt30 fcolor3 flh42 font32 rreg">{informMsg}</p>
          <div className="fcolor14 t-center mt100 flh46 font34 osansbl fw1">
            <img style={{ height: '1.7rem', width: '1.7rem' }} className="ilbl" src={require('../images/laon-2.png')} alt="" />
            <p className="mt21">{expectArrivalMsg}</p>
          </div>
          <Btn onClick={this._onBack} style={{ marginTop: '1.06rem' }}>Cheers!</Btn>
        </Page>
      );
    }
}
export default Main;
