/**
 * selectItem
 * @author Xiaolong
 */
import React from 'react';
import classnames from 'classnames';

const Main = (props) => {
  const {
    title = '', msg = '', className = 'pt37 pb37', onClick = null, icon = null,
    imgStyle = {}, style = {}, titleStyle = {}, msgStyle = {},
  } = props;
  return (
    <div onClick={onClick} style={style} className={classnames('flex ml36  borb1', className)}>
      <div className="width360 fcolor1 t-left flex-ali-center">
        {icon && <img style={{ ...{ width: '0.42rem', height: '.42rem' }, ...imgStyle }} src={icon} alt="" />}
        <div className="ml26 font32" style={{ ...{ marginLeft: '.26rem', color: '#212C68' }, ...titleStyle }}>{title}</div>
      </div>
      <div className="flex1 fcolor3 t-right flh32 pr32" style={msgStyle}>{msg}</div>
    </div>
  );
};

export default Main;
