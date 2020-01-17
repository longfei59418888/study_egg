/**
 * selectItem
 * @author Xiaolong
 */
import React from 'react';
import classnames from 'classnames';

const Main = (props) => {
  const {
    title = '', msg = '', className = 'pt34 pb34', hasIcon = true, onClick = null,
  } = props;
  return (
    <div onClick={onClick} className={classnames('flex ml52  borb1', className)}>
      <div className="width240 fcolor1 t-left flh32">{title}</div>
      <div className="flex1 fcolor3 t-right flh32 pr23 flex-jus-end flex-ali-center">{msg}</div>
      <p className="pr52 flex-ali-center">
        {hasIcon ? (
          <img
            style={{
              height: '.2rem',
              width: '0.11rem',
            }}
            src={require('./images/select-item.png')}
            alt="" />
        ) : ''}
      </p>
    </div>
  );
};

export default Main;
