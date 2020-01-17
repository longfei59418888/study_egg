/**
 * input
 * @author Xiaolong
 */

import React from 'react';
import { autobind } from 'core-decorators';
import classnames from 'classnames';

class Com extends React.Component {
  state={
    showClose: false,
    focus: false,
  }
  @autobind()
  onUnBlur(e) {
    const { unBlur } = this.props;
    const { target } = e;
    const { value } = target;
    if (value.length < 1) {
      this.setState({
        showClose: false,
      });
    } else {
      this.setState({
        showClose: true,
      });
    }
    unBlur(value);
  }
  @autobind()
  clear() {
    const { input } = this;
    const { unBlur } = this.props;
    input.value = '';
    this.setState({
      showClose: false,
    });

    unBlur('');
  }

  render() {
    const {
      icon = null, placeholder = '', type = 'text', defaultValue = '',
    } = this.props;
    const { onUnBlur, clear } = this;
    const { showClose, focus } = this.state;
    return (
      <div className="flex">
        {icon && (
        <div className="width70 flex-ali-center">
          <img className="width46 height46" src={icon} alt="" />
        </div>
        )}
        <div className={classnames('flex flex1 ', focus ? 'borb3' : 'borb1')}>
          <div className="height66 flex-center flex1">
            <input
              className="lh42 placeholder2 bornone font40 fcolor1 sfbold fw1 width-100"
              onFocus={(event) => {
                this.setState({ focus: true });
                const target = event.target.parentElement || '';
                if (target.scrollIntoView) {
                  target.scrollIntoView();
                } 
              }}
              onBlur={(event) => {
                onUnBlur(event);
                this.setState({ focus: false });
              }}
              placeholder={placeholder}
              defaultValue={defaultValue}
              ref={(ref) => { this.input = ref; }}
              type={type} />
          </div>
          <div className=" width45 flex-ali-center flex-jus-end">
            {showClose && <img onClick={clear} className="height32 width32 ilbl" src={require('src/pages/login/index/images/del-tel.png')} alt="" />}
          </div>
        </div>
      </div>
    );
  }
}

export default Com;
