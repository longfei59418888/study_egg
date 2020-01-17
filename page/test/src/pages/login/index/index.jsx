/**
 * login
 * @author Xiaolong
 */
import React from 'react';
import '../index.scss';
import Page from 'src/components/page';
import Btn from 'src/components/form/btn';
import { LOGIN_CONFIRM, INDEX_HOME, SETTING_LEGAL_POLICIES_DETAIL } from 'src/constants/urls';
import { autobind } from 'core-decorators';
import { infoOne, asyncOption, close } from 'src/components/modal/toast';
import connect from 'src/decorators/connect';
import { sendLoginSms, sendLoginSmsClear, saveLoginTel } from 'src/actions/user';
import { dealPhone, warnLog } from 'src/utils/extend';
import { onEvent } from 'src/utils/native';
import header from '../../../decorators/header';
import history, { setBack } from '../../../utils/init/history';

@connect(['user'], {
  sendLoginSms, sendLoginSmsClear, saveLoginTel,
})
@header()
class Main extends React.Component {
  constructor(props) {
    super();
    const { user = {} } = props;
    const { mobileNo = '' } = user.userSmsLoginInfo;
    const phone = dealPhone(mobileNo);
    this.state = {
      phone,
      showTop: false,
      showLoading: false,
      focusNum: 0,
      blurNum: 0,
    };
  }
  componentDidMount() {
    onEvent('0301', { userId: false });
    const { input } = this;
    const { sendLoginSmsClear } = this.props;
    input.onfocus = () => {
      this.setState(prevState => ({
        focusNum: prevState.focusNum + 1,
        showTop: true,
      }));
    };
    input.onblur = () => {
      setTimeout(() => {
        this.setState(prevState => ({
          blurNum: prevState.blurNum + 1,
          showTop: false,
        }));
      }, 100);
    };
    input.oninput = () => {
      const { value } = input;
      const { state } = this;
      if (input.value.length > 11) {
        input.value = state.phone;
      } else {
        const phone = dealPhone(value);
        let inputPos = input.selectionStart;
        if (state.phone.length > phone.length && /^\d{5}\s\d$/.test(phone)) inputPos -= 1;
        if (state.phone.length < phone.length && /^\d{5}\s\d$/.test(phone))inputPos += 1;
        if (phone.length > 11) inputPos = input.value.length;
        input.value = phone;
        this.setState({
          phone,
        });
        setTimeout(() => {
          if (input.value.replace(/\s+/g, '').length > 6) input.setSelectionRange(inputPos, inputPos);
        }, 0);
      }
    };
    setTimeout(() => {
      input.focus();
    }, 300);
    setBack(() => {
      setBack(null);
      onEvent('0305', { userId: false });
      sendLoginSmsClear();
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
      });
    });
  }

  componentWillUnmount() {
  }
  @autobind
  async send() {
    const { input } = this;
    const { sendLoginSms, history, user = {} } = this.props;
    const { sendTimeStart = '', sendInterval, mobileNo } = user.userSmsLoginInfo;

    const phone = input.value.replace(/\s/, '');
    if (!/^[6,7,8,9]\d{9}$/.test(phone)) {
      infoOne('Please enter valid mobile number', true, 2);
      return;
    }
    if ((sendTimeStart + sendInterval * 1000) > new Date().getTime() && phone === mobileNo) {
      history.push(LOGIN_CONFIRM);
      return;
    }
    asyncOption();
    this.setState({
      showLoading: true,
    });
    try {
      const { focusNum, blurNum } = this.state;
      onEvent('0303', {
        userId: false,
        focusNum,
        blurNum,
      });
    } catch (e) {
      warnLog(e);
    }
    const data = await sendLoginSms({
      templateName: 'smscode_login',
      mobileNo: phone,
      key: {
        mobileNo: phone,
        userNo: '',
      },
    });
    try {
      onEvent('0304', {
        userId: false,
        result: !data.ERROR_TAG ? '成功' : '失败',
        failReason: !data.msg ? '' : data.msg,
      });
    } catch (e) {
      warnLog(e);
    }
    this.setState({
      showLoading: false,
    });
    close();
    if (data) history.push(LOGIN_CONFIRM, true);
  }
  @autobind()
  clearInput() {
    const { input } = this;
    const { sendLoginSmsClear } = this.props;
    sendLoginSmsClear();
    input.value = '';
    this.setState({
      phone: '',
    });
  }
  render() {
    const { send, clearInput } = this;
    const { showTop, phone, showLoading } = this.state;
    const { history, saveLoginTel } = this.props;
    return (
      <Page className="pt14 plr52">
        <p
          className="fcolor7 rbold font42 lh40 fw1"
          onClick={() => {
            onEvent('0305', { userId: false });
            history.goBack({
              path: INDEX_HOME,
            });
          }}>
            HOME
        </p>
        <p className="mt86 rbold fw1 lh85 font72">Register/Login</p>
        <div className="mt100 bob1 height120 pt26 flex-ali-center fcolor3 lh38 font32 pos-r">
          <span className="pos-a l0 lh32" style={{ top: '-.1rem' }}>Mobile number</span>
          <span className="width77">+91</span>
          <div className="flex1 pos-r">
            <form onSubmit={(e) => {
              send();
              e.stopPropagation();
              e.preventDefault();
              return false;
            }}>
              <input
                ref={(ref) => {
                  this.input = ref;
                }}
                defaultValue={phone}
                className="width-100 bornone placeholder1 fcolor1 font40 fw1 pages-login-tel-input"
                style={{ fontFamily: 'SanFranciscoDisplay-Bold' }}
                placeholder="Mobile number linked to your Aadhaar"
                type="tel" />
            </form>
            {(phone.length > 0 && showTop) && (
              <img
                onClick={clearInput}
                className="pos-a height32 width32 r0 t0"
                src={require('./images/del-tel.png')}
                alt="" />
            )}
          </div>
        </div>
        <Btn
          className="mt100"
          onClick={() => send()}>
          {showLoading && <img className="ld1 width50 height50 mr33" src={require('../../images/loading_icon_1.png')} alt="" />}
          <span>{showLoading ? 'Loading' : 'Next'}</span>
        </Btn>
        <p className="font30 fcolor3 flh52 mt44">
          <span>By continuing，you agree to the </span>
          <span
            onClick={() => {
              onEvent('0302', { userId: false });
              saveLoginTel(phone);
              history.push(`${SETTING_LEGAL_POLICIES_DETAIL}/0`);
            }}
            className="fcolor1">
            Privacy Policy
          </span>
        </p>
      </Page>
    );
  }
}

export default Main;
