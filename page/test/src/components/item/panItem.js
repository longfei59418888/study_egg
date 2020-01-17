/**
 * panItem
 * @author Xiaolong
 */
import React from 'react';

const Main = (props) => {
  const { title = '', msg = '' } = props;
  return (
    <div className="flex pt34 pb34 borb2 ">
      <p className="width240 fcolor1 t-left lh32">{title}</p>
      <p className="flex1 fcolor3 t-left flh32">{msg}</p>
    </div>
  );
};

export default Main;
