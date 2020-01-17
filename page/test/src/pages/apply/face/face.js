import classNames from 'classnames';
import React from 'react';
import Btn from 'src/components/form/btn';

const Com = (props) => {
  const { face, hasError } = props;
  return (
    <div>
      <p
        className={classNames('rbold font56 lh66 fcolor1 fw1 nowrap', {
          fcolor10: hasError,
        })}>
        <span>Face Recognition</span>
        {hasError ? ' Failed' : ''}
      </p>
      <p className="mt30 fcolor3 flh42 font32 rreg">
        {hasError ? 'Please follow the attentions below and try the facial recognition again.' : 'All uploded images will only be used for KYC process'}
      </p>
      {!hasError && <Init face={face} />}
      {hasError && <Error face={face} />}
      <div style={{ height: '2.6rem' }} />
    </div>
  );
};

export default Com;

function Init(props) {
  const { face } = props;
  return (
    <div>
      <div className="t-center" style={{ marginTop: '1.12rem' }}>
        <img className="width220 height260 ilbl" src={require('./images/face-1.png')} alt="" />
      </div>
      <p className="t-center fcolor9 flh50 font42 mt40">
        <span>Create </span>
        <span className="fcolor7">Facial Password</span>
        <br />
        <span> For Your Account Security</span>
      </p>
      <div
        className="pos-a b46 width-100 l0 plr52">
        <Btn onClick={face}>
          <span>Proceed</span>
        </Btn>
        <p className="mt40 fcolor3 fw1 rbold font28">*Please follow the voice prompt instructions to make according movements.</p>
      </div>
    </div>
  );
}

function Error(props) {
  const { face } = props;
  const list = [
    { icon: require('./images/err-3.png'), text: 'too close' },
    { icon: require('./images/err-5.png'), text: 'too far' },
    { icon: require('./images/err-4.png'), text: 'too dark' },
    { icon: require('./images/err-1.png'), text: 'Don\'t wear a hat' },
  ];
  return (
    <div>
      <p className="t-center"><img className="ilbl mt74" style={{ height: '3.36rem', width: '2.92rem' }} src={require('./images/err-2.png')} alt="" /></p>
      <div className="flex" style={{ margin: '0.88rem -.36rem 0' }}>
        {list.map((item, index) => (
          <div key={index} className="flex1 plr22">
            <img className="width-100 height150" src={item.icon} alt="" />
            <p className="fcolor3 lh33 font28 mt21">{item.text}</p>
          </div>
        ))}
      </div>
      <div className="pos-a b46 width-100 l0 plr52">
        <Btn onClick={face}>
          <span>Try Again</span>
        </Btn>
        <p className="mt40 fcolor3 fw1 rbold font28">*Please make movements according to voice prompt</p>
      </div>
    </div>
  );
}
