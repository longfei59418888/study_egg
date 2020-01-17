/**
 * confirm
 * @author Xiaolong
 */
import { Modal } from 'antd-mobile';
import React from 'react';
import Btn from '../../form/btn';

let alertList = [];

export const closeAll = () => {
  alertList.forEach((item) => {
    item.close();
  });
  alertList = [];
  Modal.defaultProps.wrapClassName = '';
};
export const __close = alertInstance => () => {
  alertList.forEach((item, index) => {
    if (item === alertInstance) {
      item.close();
      alertList.splice(index, 1);
    }
  });
  Modal.defaultProps.wrapClassName = '';
};

export const confirm = (options) => {
  const {
    msg, ok = () => {}, cancel = () => {}, okText = 'OK', cancelText = 'Cancel', title = '', remove = true,
  } = options;
  if (remove) closeAll();
  let close = null;
  Modal.defaultProps.wrapClassName = '';
  const alertInstance = Modal.alert(title, msg, [
    {
      text: okText,
      onPress: () => {
        close();
        ok();
      },
      style: 'default', 
    },
    {
      text: cancelText,
      onPress: () => {
        close();
        cancel();
      }, 
    },
  ]);
  close = __close(alertInstance);
  alertList.push(alertInstance);
  return close;
};
export const alert = (options) => {
  const {
    msg, ok = () => {}, okText = 'Yes', title = '', remove = true,
  } = options;
  if (remove) closeAll();
  let close = null;
  Modal.defaultProps.wrapClassName = '';
  const alertInstance = Modal.alert(title, msg, [
    {
      text: okText,
      onPress: () => {
        close();
        ok();
      },
      style: 'default', 
    },
  ]);
  close = __close(alertInstance);
  alertList.push(alertInstance);
  return close;
};


const __oneAlert = (options) => {
  const {
    ok = () => {}, okText = 'Yes', title = '', remove = true, msg, hasClose = true, hasBtn = true, minWidth = true, closeBtn,
  } = options;
  if (remove) closeAll();
  let close = null;
  Modal.defaultProps.wrapClassName = 'jt-common-modal-common-alert-one';
  const alertInstance = Modal.alert(title, (
    <div className="pos-r">
      <p className="height1" />
      {hasClose && (
        <img
          onClick={() => {
            close();
            if (closeBtn) closeBtn();
          }
          }
          className="pos-a height45 width45 t25 r25"
          src={require('./images/close.png')}
          alt="" />
      )}
      {title && <div className="mt48 flh36 fw5 rmed font28" style={{ color: '#FD687D' }}>{title}</div>}
      {msg && <div style={{ minWidth: minWidth ? '5.5rem' : '' }} className="mt36 fcolor1 flh40 font28 t-left plr48">{msg}</div>}
      {hasBtn && (
      <div className="flex plr35 mt42">
        <div className="flex1 plr12">
          <Btn
            onClick={() => {
              close();
              ok();
            }}
            style={{ height: '.88rem' }}
            className="sha2">
            {okText}
          </Btn>
        </div>
      </div>
      )}
      <div className="height46" />
    </div>
  ));
  close = __close(alertInstance);
  alertList.push(alertInstance);
  return close;
};

export const oneError = options => __oneAlert({
  ...options,
  ...{
    title: <p className="t-center"><img className="height100 width100 ilbl" src={require('./images/fail.png')} alt="" /></p>,
  },
});
export const oneSuccess = options => __oneAlert({ ...options, ...{ type: 2 } });


export const oneConfirm = (options) => {
  const {
    msg, ok = () => {}, cancel = () => {}, okText = 'OK', cancelText = 'Cancel', title = '', remove = true, hasClose = true,
    end,
  } = options;
  if (remove) closeAll();
  let close = null;
  Modal.defaultProps.wrapClassName = 'jt-common-modal-common-alert-one';
  const alertInstance = Modal.alert('', (
    <div className="pos-r">
      <p className="height1" />
      {hasClose && (
        <img
          onClick={() => {
            close();
          }}
          className="pos-a height45 width45 t25 r25"
          src={require('./images/close.png')}
          alt="" />
      )}
      {title && <div className="mt48 flh36 fw5 rmed font28" style={{ color: '#FD687D' }}>{title}</div>}
      {msg && <div className="mt36 fcolor2 flh40 font28 t-left plr48">{msg}</div>}
      <div className="flex plr35 mt42">
        <div className="flex1 plr12">
          <Btn
            onClick={() => {
              close();
              cancel();
            }}
            cl="brad7 fcolor8"
            className="nosha"
            style={{ height: '.88rem', fontSize: '.34rem', fontWeight: 500 }}>
            {cancelText}
          </Btn>
        </div>
        <div className="flex1 plr12">
          <Btn
            onClick={() => {
              close();
              ok();
            }}
            className="nosha"
            style={{ height: '.88rem', fontSize: '.34rem', fontWeight: 500 }}>
            {okText}
          </Btn>
        </div>
      </div>
      <div className="height46" />
    </div>
  ));
  close = () => {
    let closeInstance = __close(alertInstance);
    closeInstance();
    closeInstance = null;
    if (end) end(); 
  };
  alertList.push(alertInstance);
  return close;
};
export const oneAlert = __oneAlert;

export const getList = () => alertList;
export default confirm;
