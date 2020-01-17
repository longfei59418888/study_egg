import React from 'react';
import '../index.scss';
import header from 'src/decorators/header';
import Page from 'src/components/page';
import { USER_APPLY_NODE_MAP, APPLY_PAN, INDEX_HOME } from 'src/constants/urls';
import { oneAlert, oneError } from 'src/components/modal/confirm';
import Sms from 'src/components/smsVerify/index.bak';
import { autobind } from 'core-decorators';
import { clock } from 'src/utils/extend';
import { setBack } from 'src/utils/init/history';
import connect from '../../../decorators/connect';
import { itemCommit, getPanResult } from '../../../actions/apply';
import { setNodeInfo } from '../utils';
import { onEvent } from '../../../utils/native';

@connect(['apply'], { itemCommit })
@header()
class Main extends React.Component {
  // static _onBack = '_onBack'
  constructor(props) {
    super(props);
    const { nodeStepInfo = {} } = props.apply;
    const { surplusTime } = nodeStepInfo.panInfo;
    this.state = {
      surplusTime,
      isSend: false,
      time: 30,
    };
  }

  componentDidMount() {
    const { surplusTime } = this.state;
    const { apply, history } = this.props;
    const { reportId } = apply.nodeStepInfo.panInfo;
    onEvent('0601');
    this.closeClock = clock(surplusTime, (time) => {
      if (time === -1) {
        clearTimeout(this.getResultLoop);
        this.timeOut();
        return;
      }
      this.setState({
        surplusTime: time,
      });
    });
    setBack(() => {
      setBack(null);
      onEvent('0603');
      this._onBack();
    });
    const getResult = () => {
      getPanResult(reportId).then((rst) => {
        if (!rst) return;
        const { verifiedResult, surplusTime, pollingTime } = rst;
        if (verifiedResult === 'S') {
          this.closeClock.clear();
          setNodeInfo(rst);
          onEvent('0602', { result: '有效' });
          history.push(USER_APPLY_NODE_MAP[rst.nextNodeCode]);
        } else if (verifiedResult === 'F') {
          this.closeClock.clear();
          onEvent('0602', { result: '无效' });
          this.timeOut(true);
        } else {
          if (surplusTime < 1) {
            this.closeClock.clear();
            onEvent('0602', { result: '超时' });
            this.timeOut();
            return;
          }
          this.getResultLoop = setTimeout(() => {
            this.getResultLoop = null;
            getResult();
          }, pollingTime * 1000);
        }
      });
    };
    this.getResultLoop = setTimeout(() => { getResult(); }, 500);
  }

  componentWillUnmount() {
    this.closeClock.clear();
    clearTimeout(this.getResultLoop);
  }

  @autobind()
  _onBack() {
    const { history } = this.props;
    history.goBack({
      path: INDEX_HOME,
    });
  }

 @autobind()
  timeOut(type) {
    const { history } = this.props;
    oneError({
      msg: (
        <div className="t-center">
          <p className="font36 fw5 rmed fcolor1 ">{type ? 'Invalid PAN' : 'Overtime'}</p>
          <p style={{ marginTop: '.11rem' }}>please click on the button at the bottom to rescan your PAN card.</p>
        </div>
      ),
      okText: 'Re-scan',
      closeBtn: () => {
        history.replace(APPLY_PAN);
      },
      ok: () => {
        // this._onBack();
        history.replace(APPLY_PAN);
      },
    });
  }

  @autobind()
 showOtp() {
   const { init, focus, send } = this;
   const { isSend, time } = this.state;
   oneAlert({
     hasClose: false,
     hasBtn: false,
     title: <p className="font38 rbold fw1 fcolor1">Enter The OTP</p>,
     msg: (
       <div>
         <p className="flh40 fcolor3 font28">
           <span>A text message with a 4-digit OTP code was sent to:</span>
           <span className="fcolor1"> 99715 99999</span>
         </p>
         <Sms init={init} focus={focus} length={4} send={send} isSend={isSend} time={time} />
       </div>
     ),
   });
 }
  render() {
    const { surplusTime } = this.state;
    return (
      <Page className="pl42 pr42 pt34">
        <p className="rbold font50 fcolor1 fw1">Don&apos;t leave this page</p>
        <p className="pt32 fcolor3 font32 flh42 nowrap">
          Please wait
          <span className="fw5 rmed font41 fcolor1">
            {` ${surplusTime}s`}
          </span>
           . We are rushing on this.
        </p>
        <div className="t-center">
          <img src={require('../images/waiting.png')} className="ilbl width170 height170 mt150 mb38" alt="" />
          <p className="font44 fcolor14">Wait for a moment...</p>
        </div>
      </Page>
    );
  }
}

export default Main;
