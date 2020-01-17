import React from 'react';
import classnames from 'classnames';
import { autobind } from 'core-decorators';
import { onEvent } from '../../utils/native';

class SmsVerify extends React.Component {
  constructor(props) {
    super(props);
    const { length = 4 } = props;
    this.state = {
      numberArray: Array(length).fill(''),
      focusNum: 0,
    };
    this.preSmsCode = '';
    this.inputIng = false;
  }
  componentDidMount() {
    const { init, focus, length = 4 } = this.props;
    const { clearNum } = this;
    init();
    setTimeout(() => {
      this.input0.focus();
    }, 300);
    this[`input${length - 1}`].addEventListener('blur', () => {
      const { numberArray } = this.state;
      const smsCode = numberArray.join('');
      if (smsCode.replace(/\s/, '').length < numberArray.length) return;
      this.preSmsCode = smsCode;
      focus(smsCode, clearNum);
    }, { passive: true });
  }
  componentWillUnmount() {
  }

  focus = (e) => {
    const { target } = e;
    const parent = target.parentNode;
    parent.parentNode.parentNode.querySelectorAll('.flex1').forEach((item) => {
      item.querySelector('.borb1').classList.remove('pages-login-sms-input');
    });
    parent.classList.add('pages-login-sms-input');
    this.setState(prevState => ({
      focusNum: prevState.focusNum + 1,
    }));
  }

  @autobind()
  click() {
    const { numberArray } = this.state;
    let cIndex = null;
    numberArray.forEach((item, index) => {
      if (item.length < 1 && cIndex === null) cIndex = index;
    });
    this[`input${cIndex === null ? numberArray.length - 1 : cIndex}`].focus();
  }


  @autobind()
  change(e) {
    const { target } = e;
    const { numberArray, focusNum } = this.state;
    const { length } = numberArray;
    const index = parseInt(target.getAttribute('data-index'));
    numberArray[index] = target.value;

    if (target.value.length === 1 && index < length - 1) {
      this[`input${index + 1}`].focus();
    } else if (target.value.length === 0 && index > 0) {
      this[`input${index - 1}`].focus();
    } else if (target.value.length >= 2) {
      target.value = target.value.substr(target.value.length - 1, 1);
      numberArray[index] = target.value;
      if (index < length - 1) {
        this[`input${index === length - 1 ? index : index + 1}`].focus();
      } else if (this.preSmsCode !== numberArray.join('')) {
        this[`input${length - 1}`].blur();
      }
    } else {
      this[`input${length - 1}`].blur();
    }
    this.setState({
      numberArray,
    });
    onEvent('0402', {
      onfocus: focusNum,
      onblur: focusNum,
    });
  }
  @autobind()
  clearNum() {
    const { numberArray } = this.state;
    numberArray.forEach((item, key) => {
      if (item) this[`input${key}`].value = '';
    });
    const { length = 4 } = this.props;
    this.setState({
      numberArray: Array(length).fill(''),
    });
    this.input0.focus();
  }
  render() {
    const { send, isSend, time } = this.props;
    const { numberArray } = this.state;
    const {
      focus, click, change, clearNum,
    } = this;
    return (
      <div>
        <div className=" height120 pt88 flex-ali-center fcolor3 lh38 font32 pos-r" style={{ margin: '0 -.24rem' }}>
          <div className="width-100 flex">
            {numberArray.map((item, key) => (
              <div key={key} className="flex1 flex-center height160 pos-r plr24">
                <div className="borb1 width-100 flex-center flex-center pb14">
                  <p
                    onClick={click}
                    data-index={key}
                    className="pos-a width-100 height-100 l0 t0 zindex9 fw1 font72" />
                  <input
                    onKeyUp={change}
                    onFocus={focus}
                    data-index={key}
                    style={{ width: 20 }}
                    ref={(input) => {
                      this[`input${key}`] = input;
                    }}
                    className=" height80 t-center bornone width-100 font72"
                    type="number" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <p
          className={classnames('flex flex-jus-end mt52 font32 lh32', {
            fcolor8: isSend,
            fcolor3: !isSend,
          })}>
          {!isSend && (<span className="fcolor1">{`${time}s`}</span>)}
          <span onClick={() => {
            clearNum();
            send(true);
          }}>
              &nbsp;&nbsp;Re-send
          </span>
        </p>
      </div>
    );
  }
}

export default SmsVerify;
