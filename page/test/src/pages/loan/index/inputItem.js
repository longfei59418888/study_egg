/**
 * 360loan-india 借款
 * @author Xiaolong
 */

import React from 'react';
import { autobind } from 'core-decorators';
import { onEvent } from '../../../utils/native';


class Com extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: 0,
      focusNum: 0,
    };
  }

  @autobind()
  change(e) {
    // const { max, min } = this.props;
    const { target } = e;
    const { value } = target;
    if (this.loop) clearTimeout(this.loop);
    this.loop = setTimeout(() => {
      this.blur({ target: { value } });
    }, 300);
    // let val = value.replace(/[^0-9]/g, '');
    // if (val.length > 0)val = parseInt(val);
    // if (val === 0) val = '';
    // if (val > 0 && val < 10) val *= 1000;
    // if (val > 10 && val < 1000) val = '';
    // if (val >= 1000) {
    //   const num = val % 10;
    //   val = parseInt(val / 1000);
    //   val = (val + num) * 1000;
    // }
    // if (max < val) val = parseInt(max / 1000) * 1000;
    // target.value = val;
    // setTimeout(() => {
    //   target.setSelectionRange(target.value.length - 3, target.value.length - 3);
    // }, 0);
  }

  @autobind()
  blur(e) {
    let { max = 0, min = 0, stepAmt = 0 } = this.props;
    max = parseFloat(max);
    min = parseFloat(min);
    stepAmt = parseFloat(stepAmt);
    const { target } = e;
    const { value } = target;
    let error = 0;
    if (value.length > 0 && value % stepAmt !== 0) error = 3;
    if (value.length > 0 && value > max) error = 2;
    if (value.length > 0 && value < min) error = 1;
    onEvent('1502', { userId: true, onblur: 1 });
    this.setState({ error });
    this.setState(prevState => ({
      focusNum: prevState.focusNum + 1,
    }));
  }

  render() {
    const { props } = this;
    const {
      max, min, stepAmt, defaultValue, 
    } = this.props;
    const { error } = this.state;
    return (
      <div className="plr50 pt70 bgcolor6 pb28">
        <p className="lh35 rmed fw5 font30 fcolor1">Loan Amount</p>
        <div className="flex borb3 fw1 rmed" style={{ height: '1.54rem' }}>
          <p className="width60 lh66 fw1 font66 rmed" style={{ paddingTop: '0.72rem' }}>&#x20B9;</p>
          <div className="flex1 pt40">
            <input
              defaultValue={defaultValue || parseInt(max).toFixed(2)}
              ref={(ref) => { this.input = ref; }}
              onKeyUp={this.change}
              onBlur={this.blur}
              className="font112 width-100 bornone "
              style={{ height: '1rem', lineHeight: '1rem' }}
              type="number" />
          </div>
          <div className="width80 flex flex-center pt20">
            <p
              onClick={() => {
                onEvent('1503', { userId: true });
                this.input.value = (parseInt(max / stepAmt) * stepAmt).toFixed(2);
                this.setState({ error: 0 });
              }}
              className="bgcolor7 lh36 width78 fcolor6 rbold fw1 font28 rad36 flex flex-center">
              Max
            </p>
          </div>
        </div>
        {error ? (<p className="fcolor10 height37 flh30 font26 mt25">{props.error[error]}</p>) : (
          <p className="fcolor3 height37 flh30 font26 mt25">
            Available amount:
            {` ₹${min}-₹${max}`}
          </p>
        )}
      </div>
    );
  }
}

export default Com;
