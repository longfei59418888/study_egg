/**
 * confirm
 * @author Xiaolong
 */
import React from 'react';
import Page from 'src/components/page';
import { autobind } from 'core-decorators';
import {
  clock, dealPhone, getThrottle, warnLog, isFunction,
} from 'src/utils/extend';
import SmsVerify from 'src/components/smsVerify/index.bak';
import { getAddressInfo, getDeviceFingerPrintParams, onEvent } from 'src/utils/native';
import { loadingOne, close, successOne } from 'src/components/modal/toast';
import { INDEX_HOME } from 'src/constants/urls';
import header from '../../../decorators/header';
import connect from '../../../decorators/connect';
import preRepeat from '../../../decorators/preRepeat';
import { sendLoginSms, userLogin, sendLoginSmsClear } from '../../../actions/user';

const throttle = getThrottle(500);

@connect(['user'], {
  sendLoginSms,
  sendLoginSmsClear,
  userLogin,
})
@header()
class Main extends React.Component {
  constructor(props) {
    super(props);
    const { user = {} } = props;
    const { mobileNo = '' } = user.userSmsLoginInfo;
    this.state = {
      isSend: true,
      time: 29,
      mobileNo: dealPhone(mobileNo),
    };
  }
  componentDidMount() {
    onEvent('0401', { userId: false });
  }

  componentWillUnmount() {
    if (this.clockTime) this.clockTime.clear();
    onEvent('0405', { userId: false });
  }

  @autobind()
  async send(type) {
    const { sendLoginSms } = this.props;
    const { isSend } = this.state;
    let { mobileNo } = this.state;
    mobileNo = mobileNo.replace(/\s/, '');
    if (!isSend) return;
    if (type) {
      loadingOne();
      const rst = await sendLoginSms({
        templateName: 'smscode_login',
        mobileNo,
        key: {
          mobileNo,
          userNo: '',
        },
      });
      try {
        onEvent('0403', {
          userId: false,
          result: !rst.ERROR_TAG ? '成功' : '失败',
          failReason: !rst.msg ? '' : rst.msg,
        });
      } catch (e) {
        warnLog(e);
      }
      if (!rst) return;
      successOne('New OTP code has been sent', 1);
    }
    const { user = {} } = this.props;
    const { sendTimeStart, sendInterval } = user.userSmsLoginInfo;
    const startTime = (new Date().getTime() - sendTimeStart) / 1000;
    const time = parseInt(sendInterval - startTime);
    if (time > 0) {
      this.setState({
        isSend: false,
        time,
      });
      this.clockTime = clock(time, (time) => {
        this.setState({
          time,
        });
        if (time === -1) {
          this.setState({
            isSend: true,
          });
        }
      });
    } else {
      this.setState({
        isSend: true,
        time: sendInterval,
      });
    }
  }

  @autobind()
  @preRepeat()
  async login(smsCode, clearNum) {
    if (throttle()) return;
    loadingOne();
    const {
      userLogin, user = {}, sendLoginSmsClear, history,
    } = this.props;
    const deviceInfo = await getDeviceFingerPrintParams() || {};
    const geoInfo = await getAddressInfo({
      realTime: 'Y',
      isMust: 'Y',
    });
    if (geoInfo.ERROR_TAG || deviceInfo.ERROR_TAG) {
      close();
      if (isFunction(clearNum)) clearNum();
      return; 
    }
    const { cdKey, mobileNo } = user.userSmsLoginInfo;
    const rst = await userLogin({
      cdKey,
      smsCode,
      mobileNo,
      key: {
        mobileNo,
      },
      geoInfo,
    });
    const { rlflag } = rst;
    try {
      onEvent('0404', {
        userId: false,
        GPS: !geoInfo.ERROR_TAG ? '拒绝' : '允许',
        device: !deviceInfo.ERROR_TAG ? '拒绝' : '允许',
        result: !rst ? '失败' : '成功',
        failReason: !rst.msg ? '' : rst.msg,
        mode: rlflag === 'R' ? '注册' : '登录',
      });
    } catch (e) {
      warnLog(e);
    }
    if (!rst) {
      return;
    }
    sendLoginSmsClear();
    successOne('Successful login', 2);
    if (rlflag === 'L') {
      onEvent('af_login', {
        userId: false,
        reportAF: 'Y',
      });
    } else {
      onEvent('af_complete_registration', {
        userId: false,
        reportAF: 'Y',
      });
    }
    const { state = {} } = history;
    const { loginPath = INDEX_HOME, loginPathType = 2, loginToPath = INDEX_HOME } = state;
    setTimeout(() => {
      close();
      if (loginPathType === 2) {
        history.goBack({
          path: loginPath,
        });
      } else {
        history.routerList = history.routerList.slice(0, history.routerList.length - 2);
        history.push(loginToPath);
      }
    }, 2000);
  }

  render() {
    const { isSend, time, mobileNo } = this.state;
    const { send, login } = this;
    const { history } = this.props;
    return (
      <Page className="pt14 plr52">
        <p
          className="fcolor7 rbold font42 lh40 fw1"
          onClick={() => {
            onEvent('0405', { userId: false });
            history.goBack();
          }}>
          BACK
        </p>
        <p className="mt86 rbold fw1 lh85 font72">Enter The OTP</p>
        <p className="flh52 fcolor3 font32 mt36">
          <span>A text message with a 4-digit OTP code was sent to:</span>
          <span className="fcolor1">{mobileNo}</span>
        </p>
        <SmsVerify isSend={isSend} time={time} focus={login} send={send} init={send} length={4} />
      </Page>
    );
  }
}

export default Main;
