/**
 * header
 * @author Xiaolong
 */
import React from 'react';
import classnames from 'classnames';

const Com = (props) => {
  const {
    left = [], right = [], className, title, center, style = {},
  } = props;
  return (
    <div style={style} className={classnames('jt-common-header flex pos-r', className)}>
      <div className="nav-left pos-a zindex9 l0 t0 height-100 flex flex-ali-center pl52">
        {left.map(item => (
          <div key={item.icon || item.text} onClick={item.onClick} className="item flex height-100 flex-center ">
            {item.icon ? <img className="width39 header34" src={item.icon} alt="" /> : <p>{item.text}</p>}
          </div>
        ))}
      </div>
      <div className="nav-title flex1 flex-center pos-r zindex1 lh47 rbold fw1 font40 height-100">{center || <p>{title}</p>}</div>
      <div className="nav-right pos-a zindex3  r0 t0 height-100 flex flex-jus-end flex-ali-center pr52">
        {right.map(item => (
          <div key={item.icon || item.text} onClick={item.onClick} className="item  flex height-100 flex-center">
            {item.icon ? <img className="height44 width44" src={item.icon} alt="" /> : <p>{item.text}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};


export default Com;
