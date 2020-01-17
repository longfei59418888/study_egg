/**
 * btn
 * @author Xiaolong
 */
import React from 'react';
import classnames from 'classnames';

const Main = (props) => {
  const {
    children, color, className, style, onClick,
  } = props;
  let { cl = 'bgcolor7 sha1 rad8' } = props;
  switch (color) {
    case 'bgcolor7':
      cl = '';
      break;
    case 'bgcolor12':
      cl = 'bgcolor12 rad8 bgcolor7';
      break;
    case 'bgcolor7-bg':
      cl = 'brad7';
      break;
    default: break;
  }
  return (
    <div onClick={onClick} style={style} className={classnames('width-100 height100 flex-center fcolor6 fw5 font36 rmed', cl, className)}>
      <div className="flex-center ">{children}</div>
    </div>
  );
};

export default Main;
