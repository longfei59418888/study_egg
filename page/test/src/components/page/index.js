/**
 * 页面入口
 * @author Xiaolong
 */
import React from 'react';

const Main = (props) => {
  const { children, className = '', style = {} } = props;
  return (
    <div className={className} style={style}>{children}</div>
  );
};


export default Main;
