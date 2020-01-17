/**
 * itemLoan
 * @author Xiaolong
 */
import React from 'react';
import classnames from 'classnames';

const Main = (props) => {
  const { title = '', msg = '', className } = props;
  return (
    <div className={classnames('flex', className)}>
      <div className="width340 fcolor2 t-left flh33 font28 flex-ali-center rreg">{title}</div>
      <div className="flex1 t-right flh32 fcolor1 osansbl fw5 font28">{msg}</div>
    </div>
  );
};

export default Main;
