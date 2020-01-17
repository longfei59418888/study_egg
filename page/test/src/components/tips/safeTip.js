/**
 * tip1
 * @author Xiaolong
 */
import React from 'react';

const Main = (props) => {
  const { msg = 'Privacy data on platform are protected by bank-level security measures', style = {} } = props;
  return (
    <div className="flex flex-center height36 pos-a width-100 b52 l0 pl56 pr38 pb30" style={style}>
      <img className="width36 height36 mr18" src={require('./safe-tip.png')} alt="" />
      <p className="lh32 flh36 fcolor3 font32">{msg}</p>
    </div>
  );
};

export default Main;
