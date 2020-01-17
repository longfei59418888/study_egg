import React from 'react';

import Iscroll from 'src/components/iscroll/refresh';
import Swpier from 'src/components/swpier';
import { getUserIndexSummaryInfo } from 'src/actions/user';
import { oneError } from 'src/components/modal/confirm';
import { loadingOne, close } from 'src/components/modal/toast';
import { setIndexTab } from 'src/actions/global';
import { isLogin, showEmail } from 'src/utils/common';
import { autobind } from 'core-decorators';
import { openDebugPage, onEvent } from 'src/utils/native';
import connect from '../../../decorators/connect';
import Apply from './applyItem';

const swipers = [
  // { image: require('../images/test-img.png') },
  // { image: require('../images/test-img.png') },
];
const navs = [
  { image: require('../images/nav-1.png'), text: 'Easy to apply' },
  { image: require('../images/nav-2.png'), text: 'Fast approval' },
  // { image: require('../images/nav-3.png'), text: 'High loan limit' },
  // { image: require('../images/nav-4.png'), text: 'Low interest rate' },
];

@connect(['user'], {
  getUserIndexSummaryInfo,
  setIndexTab,
})
class Main extends React.Component {
  async componentWillMount() {
    const { setIndexTab } = this.props;
    setIndexTab({ index: 1 });
    this.getIndexData();
  }
  componentDidMount() {
    onEvent('0201', {
      stateId: true,
    });
  }
  @autobind()
  async getIndexData() {
    const { getUserIndexSummaryInfo, user } = this.props;
    const { userIndexSummaryInfo = {} } = user;
    if (isLogin()) {
      if (!userIndexSummaryInfo.userState) loadingOne();
      const rst = await getUserIndexSummaryInfo();
      if (!userIndexSummaryInfo.userState) {
        setTimeout(() => {
          close();
        });
      }
      if (rst && rst.userState === 'LDJ') {
        oneError({
          msg: (
            <div>
              <p className="lh42 font36 rmed fw5 t-center fcolor1">Opps! Loan disbursal failed</p>
              <p className="font28 t-center fcolor1 mt16">Due to the failure of loan disbursal, your loan application has been canceled without any charging. You may apply again immediately.</p>
            </div>
          ),
          okText: 'OK',
          ok: () => {
            onEvent('0205', { operation: '确定' });
          },
        });
      }
    }
  }


  render() {
    const { user } = this.props;
    const { userIndexSummaryInfo } = user;
    const {
      userState = '', applInfo = {}, loanInfo = {}, defaultCreditAmt = '', infromMsg = '',
    } = userIndexSummaryInfo;
    let clickTimes = 0;
    return (
      <div className="pos-a t0 bgC1 width-100" style={{ bottom: '1.06rem' }}>
        <div className="pos-a t0 height120 l0 width-100 flex flex-ali-center plr35 bgcolor6" style={{ paddingTop: '.06rem' }}>
          <img style={{ width: '2.72rem' }} src={require('../images/logo.png')} alt="" className="height36" />
          {/* <p className="nowrap font26 fcolor3 pl20 height36" style={{ lineHeight: '0.44rem' }}>Instant Online Credit for Everyone</p> */}
        </div>
        <div className="pos-a t120 b0 width-100 ">
          <Iscroll
            refreshHeight={60}
            refreshState={{
              init: <p><img style={{ width: '60px' }} src={require('../../images/index-loadding.png')} alt="" /></p>,
              canLoading: <p><img style={{ width: '60px' }} src={require('../../images/index-loadding.png')} alt="" /></p>,
              loading: <p><img style={{ width: '60px' }} src={require('../../images/index-loging-2.gif')} alt="" /></p>,
              end: <p><img style={{ width: '60px' }} src={require('../../images/index-loadding.png')} alt="" /></p>,
            }}
            onRefresh={async (that) => {
              const outTime = await this.getIndexData();
              setTimeout(() => {
                that.refreshEnd();
              }, outTime);
            }}
            bounce>
            <div className="plr30 bgcolor6">
              <Apply userState={userState} infromMsg={infromMsg} applInfo={applInfo} loanInfo={loanInfo} defaultCreditAmt={defaultCreditAmt} />
              {swipers.length > 0 ? (
                <Swpier className="mt40 height180" swipe={swipers.length > 1}>
                  {swipers.map((item, index) => <div key={index} className="swiper-slide"><img className="height180" src={item.image} alt="" /></div>)}
                </Swpier>
              ) : ''}
              <Nav />
            </div>
            <div className="pt70 fcolor3 flh33 font24 t-center osans pb60">
              <p onClick={() => {
                clickTimes += 1;
                if (loop) clearTimeout(loop);
                if (clickTimes > 2) {
                  openDebugPage();
                }
                const loop = setTimeout(() => {
                  clickTimes = 0;
                }, 1000);
              }}>
                <span>
                  Have a question? Please feel free to contact us
                </span>
              </p>
              <p
                onClick={() => {
                  showEmail('0207');
                }}
                className="jt-page-index-contact flex flex-center">
                <img className="height24 width24" style={{ marginRight: '.1rem' }} src={require('../images/index-contact.png')} alt="" />
                <span>Customer Service</span>
              </p>
            </div>
          </Iscroll>
        </div>
      </div>
    );
  }
}

function Nav() {
  return (
    <div className="clear bot1 jt-pages-index-home-nav">
      <img className="width-100 height40 ilbl" src={require('../images/shadow.png')} style={{}} alt="" />
      {navs.map((item, index) => {
        const { image, text } = item;
        return (
          <div key={index} className="left " style={{ width: '50%' }}>
            <div className="flex flex-ali-center height140">
              <img className="width54 height54 mr16 bgcolor6 ilbl" src={image} alt="" style={{ overflow: 'visible' }} />
              <p>{text}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Main;
