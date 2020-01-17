/**
 * selectItem
 * @author Xiaolong
 */
import React from 'react';
import classnames from 'classnames';

const Main = (props) => {
  const {
    title = '', msg = '', className = 'pt37 pb37', hasArraw = require('./images/arraw-2.png'), onClick = null, icon = null,
    imgStyle = {}, rightStyle = {}, titleStyle = {},
  } = props;
  return (
    <div onClick={onClick} className={classnames('flex ml36  borb1', className)}>
      <div className="width360 fcolor1 t-left flh32 flex-ali-center" style={{ ...{ color: '#212C68' }, ...titleStyle }}>
        {icon && <img style={{ ...{ width: '0.42rem', height: '.42rem', marginRight: '.26rem' }, ...imgStyle }} src={icon} alt="" />}
        <div className="font32">{title}</div>
      </div>
      <p className="flex1 fcolor3 t-right flh32 pr23">{msg}</p>
      <p className="pr52 flex-ali-center" style={rightStyle}>
        {hasArraw ? (
          <img
            style={{
              height: '.2rem',
              width: '.2rem',
            }}
            src={hasArraw}
            alt="" />
        ) : ''}
      </p>
    </div>
  );
};

export default Main;
