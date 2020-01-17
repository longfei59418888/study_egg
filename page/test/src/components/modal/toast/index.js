/**
 * toast
 * @author Xiaolong
 */
import { Toast } from 'antd-mobile';
import React from 'react';
import classnames from 'classnames';

export const failOne = () => {
  Toast.hide();
  setTimeout(() => Toast.info(<div>fail</div>, 100), 0);
};
export const successOne = (msg, time = 3) => {
  Toast.hide();
  const Com = (
    <div className="t-center width240 pt30 pb40" style={{ minHeight: '2.4rem' }}>
      <img className="width80 height80 ilbl" src={require('./images/tip_success.png')} alt="" />
      <p className="mt24 flh33 fcolor6 font28 plr17">{msg}</p>
    </div>
  );
  setTimeout(() => Toast.info(Com, time), 0);
};

// 提示
export const infoOne = (msg, icon = false, time = 3) => {
  Toast.hide();
  if (icon && icon === true) {
    icon = require('./images/tips_msg.png');
  }
  const minWidth = icon ? '5.52rem' : '2.4rem';
  const Com = (
    <div className={classnames('flex-ali-center  pt30 pb30 plr50', { 'flex-jus-between': !icon })} style={{ minHeight: '.92rem', minWidth, maxWidth: '5.6rem' }}>
      {icon && <p className="width60"><img className="height36 width36" src={icon} alt="" /></p>}
      <div className="flh45 fcolor6 font30 t-left flex1">{msg}</div>
    </div>
  );
  setTimeout(() => Toast.info(Com, time), 0);
};

// 加载 loading
export const loadingOne = (msg = 'Loading') => {
  Toast.hide();
  const Com = (
    <div className="t-center width240 pt60" style={{ minHeight: '2.4rem' }}>
      <img src={require('./images/request_ing.png')} className="width60 height60 ilbl ld1" alt="" />
      <p className="mt33 flh33 fcolor6 font28">{msg}</p>
    </div>
  );
  setTimeout(() => Toast.info(Com, 3 * 60), 0);
};

export const loading = () => {
  Toast.hide();
  const Com = (
    <div className="flex-center width140 height140">
      <img className="width60 height60 ld1" src={require('./images/request_ing.png')} alt="" />
    </div>
  );
  setTimeout(() => Toast.info(Com, 60 * 60), 0);
};

export const asyncOption = () => {
  Toast.hide();
  setTimeout(() => Toast.info('', 60 * 60), 0);
};

export const close = () => {
  Toast.hide();
};
export default Toast.info;
