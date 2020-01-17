/**
 * popup
 * @author Xiaolong
 */

import React from 'react';
import Btn from '../../form/btn';
import popup from './index';

export default (option) => {
  const {
    title,
    mTitle,
    icon,
    children,
    onClick,
    btnText,
  } = option;
  const closePopup = popup((
    <div className="pt60 t-left">
      <p className="fcolor1 plr40 pos-r  lh66 rbold fw1 font56">
        <span>{title}</span>
        <img onClick={() => { closePopup(); }} className="height50 width50 pos-a r40 t10" src={require('../images/close.png')} alt="" />
      </p>
      <p className="fcolor3 plr40 mt26 font26 fcolor12">{mTitle}</p>
      {!icon ? '' : <p className="mt16"><img style={{ height: '2.3rem' }} src={icon} alt="" /></p>}
      <div className="ofy plr40 flh46 fcolor1 font28 pb20" style={{ height: '4.3rem' }}>
        {children}
      </div>
      <div className="sha2 pt40 plr40" style={{ height: '1.8rem' }}>
        <Btn onClick={onClick}>
          <span>{btnText}</span>
        </Btn>
      </div>
    </div>
  ), {});
  return closePopup;
};
