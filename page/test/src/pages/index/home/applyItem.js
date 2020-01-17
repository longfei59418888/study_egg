import React from 'react';
import Btn from 'src/components/form/btn';
import history from 'src/utils/init/history';
import {
  REPAY_INDEX, LOGIN_INDEX, LOAN_INDEX,
  PROTOCOL_APPLY,
} from 'src/constants/urls';
import { isLogin } from 'src/utils/common';
import { toApply, applyActivationCheck } from 'src/pages/apply/utils';
import { getStoreDispatch } from 'src/store';
import { userLoanPreCheck } from 'src/actions/loan';
import { repayTrail } from 'src/actions/repayment';
import { loadingOne, close, infoOne } from 'src/components/modal/toast';
import { onEvent } from '../../../utils/native';

const trailPay = async (loanReqNo) => {
  loadingOne();
  const firstTime = new Date().getTime();
  const rst = await repayTrail({
    loanReqNo,
  });
  const secondesTime = new Date().getTime();
  onEvent('0204', {
    result: '成功',
    operationTime: ((secondesTime - firstTime) / 1000).toFixed(0),
  });
  close();
  if (rst) history.push(REPAY_INDEX);
};

const NoLogin = (prop) => {
  const { defaultCreditAmt, userState, infromMsg } = prop;
  return (
    <div className="no-login">
      <p className="t-center lh32 font32 fcolor13">Get Instant Cash of up to</p>
      <p className="rbold lh100 mt30 fcolor6  t-center" style={{ fontSize: '1rem' }}>
        <span style={{ fontSize: '.66rem' }}>&#x20B9;</span>
        <span className="pl8 rreg fw1">{defaultCreditAmt}</span>
      </p>
      <p className="fcolor13 mt42 t-center nowrap font24">{infromMsg}</p>
      <div className="plr42">
        <Btn
          onClick={async () => {
            if (isLogin()) {
              if (['SNA', 'COT'].indexOf(userState) !== -1) {
                const rst = await applyActivationCheck();
                if (!rst) return;
                if (rst.activationFlag !== 'Y') {
                  infoOne('not eligible for our loan now');
                  return;
                }
                history.push(PROTOCOL_APPLY);
              } else {
                const apply = async () => {
                  await toApply({
                    pwdCall: async () => {
                      await apply();
                    },
                  });
                };
                await apply();
              }
              return;
            }
            history.push(LOGIN_INDEX);
          }}
          cl="index-btn mt60 font34 sha5">
          <span>Get Instant Approval</span>
          <img className="ml14" style={{ width: '0.13rem', height: '0.19rem' }} src={require('../images/left-icon.png')} alt="" />
        </Btn>
      </div>
    </div>
  );
};

const Applyed = () => (
  <div className="pt56">
    <p className="t-center  font32 fcolor13">
      <img className="ilbl" style={{ width: '1.32rem', height: '1.32rem' }} src={require('../images/apply-ing.png')} alt="" />
    </p>
    <p className="t-center lh32 font36 nowrap fcolor6 mt34">Application Under Evaluation</p>
    <p className="fcolor13 mt30 t-center font24 flh28 plr50 pb12" style={{ color: '#B0C9F7' }}>
      {'Currently there are a huge number of applicants for our loans. Don\'t worry. It will only take a few minutes for approval and you\'ll get notified once it\'s done.'}
    </p>
  </div>
);

const Seccuss = (prop) => {
  const {
    creditAmt = null,
    contractNo = '',
    applNo = '',
  } = prop.applInfo;
  return (
    <div className="apply-seccuss">
      <p className="t-center lh32 font32 fcolor13">{'You\'re eligible for loan of up to'}</p>
      <p className="rbold lh100 mt30 fcolor6  t-center" style={{ fontSize: '1rem' }}>
        <span style={{ fontSize: '.66rem' }}>&#x20B9;</span>
        <span className="pl8 ">{creditAmt}</span>
      </p>
      <p className="fcolor13 mt42 t-center nowrap font24">Please apply for your loan before your credit line expires. </p>
      <div className="plr42">
        <Btn
          onClick={async () => {
            if (!contractNo || !applNo) return;
            loadingOne();
            const loanPreCheck = userLoanPreCheck({
              contractNo,
              applNo,
            });
            const rst = await loanPreCheck(getStoreDispatch);
            onEvent('0203', {
              result: '成功',
            });
            close();
            if (rst) history.push(LOAN_INDEX);
          }}
          cl="index-btn mt60 font34 sha5">
          <span>Get it Now</span>
          <img className="ml14" style={{ width: '0.13rem', height: '0.19rem' }} src={require('../images/left-icon.png')} alt="" />
        </Btn>
      </div>
    </div>
  );
};

const OnLoan = (props) => {
  const { loanInfo = {} } = props;
  const { loanReqNo, rpyAmt } = loanInfo;
  return (
    <div className="no-login">
      <p className="t-center lh32 font32 fcolor13">Repaying on time may boost credit line up to</p>
      <p className="rbold lh100 mt30 fcolor6  t-center" style={{ fontSize: '1rem' }}>
        <span style={{ fontSize: '.66rem' }}>&#x20B9;</span>
        <span className="pl8 ">{rpyAmt}</span>
      </p>
      <p className="fcolor13 mt42 t-center nowrap font24">On-time repayment will help you build a good credit score</p>
      <div className="plr42">
        <Btn
          onClick={() => {
            trailPay(loanReqNo);
          }}
          cl="index-btn mt60 font34 sha5">
          <span> Repay Now</span>
          <img className="ml14" style={{ width: '0.13rem', height: '0.19rem' }} src={require('../images/left-icon.png')} alt="" />
        </Btn>
      </div>
    </div>
  );
};

const Overdue = (props) => {
  const { loanInfo = {} } = props;
  const { loanReqNo } = loanInfo;
  return (
    <div className="pt56">
      <p className="t-center  font32 fcolor13">
        <img className="ilbl" style={{ width: '1.32rem', height: '1.32rem' }} src={require('../images/apply-fail.png')} alt="" />
      </p>
      <p className="t-center flh38 font36 nowrap fcolor6 mt30">Opps! Your loan is OVERDUE!!</p>
      <p className="fcolor13 mt16 t-center font24 flh28 plr50" style={{ color: '#B0C9F7' }}>
          Please repay as soon as possible so as to avoid affecting your personal credit score.
      </p>
      <div className="plr42">
        <Btn cl="index-btn mt40 font34 sha5">
          <p
            onClick={() => {
              trailPay(loanReqNo);
            }}
            className="flex flex-ali-center">
            <span>Repay Now</span>
            <img className="ml14" style={{ width: '0.13rem', height: '0.19rem' }} src={require('../images/left-icon.png')} alt="" />
          </p>
        </Btn>
      </div>
    </div>
  );
};

const Repayed = () => (
  <div className="pt56">
    <p className="t-center  font32 fcolor13">
      <img className="ilbl" style={{ width: '1.32rem', height: '1.32rem' }} src={require('../images/index-lpp.png')} alt="" />
    </p>
    <p className="t-center lh32 font36 nowrap fcolor6 mt34">Payment Pending</p>
    <p className="fcolor13 mt30 t-center font24 flh28 plr50 pb12" style={{ color: '#B0C9F7' }}>
      {'Your fund for repayment is currently being processed by the payment platform and banks, please wait a little a while and check the payment result later.'}
    </p>
  </div>
);

const Fail = () => (
  <div className="pt56">
    <p className="t-center  font32 fcolor13">
      <img className="ilbl" style={{ width: '1.32rem', height: '1.32rem' }} src={require('../images/apply-fail.png')} alt="" />
    </p>
    <p className="t-center flh38 font36 nowrap fcolor6 mt32">
      <span>Sorry, You are currently </span>
      <br />
      <span> not eligible for our loan</span>
    </p>
    <p className="fcolor13 mt30 t-center font24 flh28 plr50 pb12" style={{ color: '#B0C9F7' }}>We will evaluate your credit situation once again later. If you are eligible to apply for our loan, we will immediately notify you.</p>
  </div>
);


const Com = (props) => {
  const { userState } = props;
  let ApplyCom = null;
  switch (userState) {
    case 'APL':
      ApplyCom = NoLogin;
      break;
    case 'SNA':
      ApplyCom = NoLogin;
      break;
    case 'APR':
      ApplyCom = Applyed;
      break;
    case 'APS':
      ApplyCom = Seccuss;
      break;
    case 'LAP':
      ApplyCom = Applyed;
      break;
    case 'LDJ': // 放款失败
      ApplyCom = Seccuss;
      break;
    case 'ARJ': // 授信拒绝
      ApplyCom = Fail;
      break;
    case 'LRJ': // 放款拒绝
      ApplyCom = Fail;
      break;
    case 'LRP': // 已放款未逾期
      ApplyCom = OnLoan;
      break;
    case 'LOD':
      ApplyCom = Overdue;
      break;
    case 'LPP':
      ApplyCom = Repayed;
      break;
    default:
      ApplyCom = NoLogin;
      break;
  }
  return (
    <div className="jt-pages-index-home-applyitem rad8 pb44">
      {ApplyCom && <ApplyCom {...props} />}
    </div>
  );
};


export default Com;
