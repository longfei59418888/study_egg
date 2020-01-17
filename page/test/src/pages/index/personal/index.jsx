import React from 'react';
import '../index.scss';
import connect from 'src/decorators/connect';
import Page from 'src/components/page';
import Head from 'src/components/header';
import Btn from 'src/components/form/btn';
import Item from 'src/components/item/personItem';
import { setIndexTab } from 'src/actions/global';
import {
  REPAY_RECORD_LIST, SETTING_PROFILE,
  SETTING_LEGAL_POLICIES_INDEX,
  SETTING_INDEX, LOGIN_INDEX, INDEX_PERSONAL,
  SETTING_ABOUT_US, REPAY_INDEX,
} from 'src/constants/urls';
import { getThrottle, isEmptyObject } from 'src/utils/extend';
import { forwardPage, onEvent } from 'src/utils/native';
import { getPersonalInfo } from 'src/actions/user';
import { isLogin, showEmail } from '../../../utils/common';
import { getUrlInfo } from '../utils';
import { close, loadingOne } from '../../../components/modal/toast';
import { repayTrail } from '../../../actions/repayment';
import history from '../../../utils/init/history';

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
  if (rst) {
    history.push(REPAY_INDEX);
  }
};

@connect(['user'], { setIndexTab, getPersonalInfo })
class Main extends React.Component {
  async componentWillMount() {
    const { setIndexTab, getPersonalInfo } = this.props;
    setIndexTab({ index: 0 });
    if (!isLogin()) return;
    await getPersonalInfo();
  }
  componentDidMount() {
    onEvent('2201');
  }

  render() {
    const { history, user } = this.props;
    const { userPersonalInfo = {}, userIndexSummaryInfo = {} } = user;
    const { repaymentLoan = {}, userName = 'Welcome' } = userPersonalInfo;
    const throttle = getThrottle(200);
    const { loanInfo = {} } = userIndexSummaryInfo;
    const { loanReqNo } = loanInfo;
    return (
      <Page className="ofy height-100">
        <div className="pos-a zindex999 width-100 t0 height88 ofh">
          <div style={{ height: '4.30rem' }} className="pos-r" />
          <Head
            className="pos-a zindex999 width-100 t0"
            style={{ background: 'none', right: '-.12rem' }}
            right={[
              {
                icon: require('../images/person-2.png'),
                onClick: () => {
                  onEvent('2207');
                  history.push(SETTING_INDEX);
                }, 
              },
            ]} />
        </div>
        <div className="pos-r" style={{ height: '4.30rem' }}>
          <img src={require('../images/personBg.png')} className="" alt="" />
        </div>
        <div className="height70 pos-r">
          <div className="pos-a b20 l0 width-100 plr30">
            <p
              onClick={async () => {
                if (isLogin() || throttle()) return;
                onEvent('2202');
                history.push(LOGIN_INDEX, {
                  loginPath: INDEX_PERSONAL,
                });
              }}
              className="rmed fw5 font63 lh72 fcolor6 ell"
              style={{ marginBottom: '.67rem' }}>
              {isLogin() ? `hi,${userName}` : 'Login'}
            </p>
            {/* <p className="fcolor6 lh24 font24 mb60" style={{ opacity: '.7' }}>There are some slogan words or use tips</p> */}
            <div className="bgcolor6 rad8 flex" style={{ height: '1.9rem' }}>
              <div
                onClick={() => {
                  onEvent('2203');
                  history.push(SETTING_PROFILE);
                }}
                className="flex1 flex-col flex-center">
                <p><img className="width54 height62" src={require('../images/person-1.png')} alt="" /></p>
                <p className="mt22 lh28 font30">My Profile</p>
              </div>
              <div className="height80 mt56" style={{ width: 0, borderLeft: '1px solid #EBEBEB' }} />
              <div
                onClick={() => {
                  onEvent('2204');
                  history.push(REPAY_RECORD_LIST); 
                }}
                className="flex1 flex-col flex-center">
                <p><img className="width54 height62" src={require('../images/person-3.png')} alt="" /></p>
                <p className="mt22 lh28 font30">Loan Records</p>
              </div>
            </div>
          </div>
        </div>
        <div className="plr30 pt24">
          {isEmptyObject(repaymentLoan) ? '' : (
            <div className="height160 bgcolor6 rad8 flex">
              <p style={{ width: '1.04rem' }} className="pl36 pt44">
                <img style={{ width: '0.42rem' }} src={require('../images/item-1.png')} alt="" />
              </p>
              <div className="pt38 flex1">
                <p className="lh46 font46 fw1 rbold">
                  {`₹${repaymentLoan.loanAmt}`}
                </p>
                <p className="fcolor2 lh33 font28" style={{ marginTop: '0.04rem' }}>{`Required to repay in ${repaymentLoan.recentDay} today`}</p>
              </div>
              <div className="width180 pr30 pt48">
                <Btn
                  onClick={() => {
                    onEvent('2205');
                    trailPay(loanReqNo);
                  }}
                  cl="fcolor6 rad64 height64 rmed fw5"
                  style={{ background: 'rgba(255,62,77,1)', fontSize: '.3rem' }}>
                        Repay
                </Btn>
              </div>
            </div>
          )
          }
          <div className="bgcolor6 mt24 rad8">
            <Item
              onClick={() => {
                onEvent('2206');
                const param = getUrlInfo();
                forwardPage(param);
              }}
              className="pt37 pb37 borb1"
              icon={require('../images/item-3.png')}
              title="Help Center" />
            <Item
              onClick={() => {
                onEvent('2208');
                history.push(SETTING_ABOUT_US);
              }}
              className="pt37 pb37 borbtop1"
              icon={require('../images/item-4.png')}
              title="About Us" />
            <Item
              onClick={() => {
                onEvent('2209');
                history.push(SETTING_LEGAL_POLICIES_INDEX);
              }}
              className="pt37 pb37 borb5"
              icon={require('../images/item-2.png')}
              title="Legal & Policies" />
          </div>
          <div className="mt70 fcolor3 flh33 font24 t-center osans pb60">
            <p><span>Have a question? Please feel free to contact us</span></p>
            <p
              onClick={() => {
                showEmail('2210');
              }}
              className="jt-page-index-contact flex flex-center">
              <img className="height24 width24" style={{ marginRight: '.1rem' }} src={require('../images/index-contact.png')} alt="" />
              <span>Customer Service</span>
            </p>
          </div>
          <div className="height106" />
        </div>
      </Page>
    );
  }
}
export default Main;
