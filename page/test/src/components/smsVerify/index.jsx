import React from 'react';
import classnames from 'classnames';
import { autobind } from 'core-decorators';

const KEY_MAP_NUMBER = {
  48: '0',
  49: '1',
  50: '2',
  51: '3',
  52: '4',
  53: '5',
  54: '6',
  55: '7',
  56: '8',
  57: '9',
  8: 'DEL',
};

class SmsVerify extends React.Component {
  constructor(props) {
    super(props);
    const { length = 4 } = props;
    this.state = {
      numberArray: Array(length).fill(''),
    };
    this.preSmsCode = '';
    this.inputIng = false;
  }
  componentDidMount() {
    const { init } = this.props;
    init();
    setTimeout(() => {
      this.input0.focus();
    }, 300);
  }
  focus = (e) => {
    const { target } = e;
    const parent = target.parentNode;
    parent.parentNode.parentNode.querySelectorAll('.flex1').forEach((item) => {
      item.querySelector('.borb1').classList.remove('pages-login-sms-input');
    });
    parent.classList.add('pages-login-sms-input');
  }

  down = (e) => {
    const { keyCode, target } = e;
    const { numberArray } = this.state;
    const { focus } = this.props;
    const { length } = numberArray;
    const downNumber = KEY_MAP_NUMBER[keyCode];
    const index = parseInt(target.getAttribute('data-index'));
    if (downNumber) {
      if (downNumber === 'DEL' && index >= 0) {
        this[`input${index - 1}`].focus();
        target.value = '';
      } else {
        target.value = downNumber;
        numberArray[index] = target.value;
        this.setState({
          numberArray,
        });
        if (index < length - 1) {
          this[`input${index + 1}`].focus();
        } else {
          const smsCode = numberArray.join('');
          if (this.preSmsCode !== smsCode) {
            this.preSmsCode = smsCode;
            focus(smsCode);
            target.blur();
          }
        }
      }
    }
    e.preventDefault();
    e.stopPropagation();
    return false;
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

  render() {
    const { send, isSend, time } = this.props;
    const { numberArray } = this.state;
    const {
      focus, click, change, down, 
    } = this;
    return (
      <div>
        <div className=" height120 pt26 flex-ali-center fcolor3 lh38 font32 pos-r" style={{ margin: '0 -.24rem' }}>
          <div className="width-100 flex">
            {numberArray.map((item, key) => (
              <div key={key} className="flex1 flex-center height160 pos-r plr24">
                <p
                  className="borb1">
                  <span
                    onClick={click}
                    data-index={key}
                    className="pos-a width-100 height-100 l0 t0 zindex9" />
                  <input
                    onKeyUp={change}
                    onKeyDown={down}
                    onFocus={focus}
                    data-index={key}
                    ref={(input) => {
                      this[`input${key}`] = input;
                    }}
                    className=" height80 t-center bornone width-100"
                    type="tel" />
                </p>
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
          <span onClick={() => send(true)}>&nbsp;&nbsp;Re-send</span>
        </p>
      </div>
    );
  }
}

export default SmsVerify;
