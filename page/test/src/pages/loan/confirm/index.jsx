import React from 'react';
import Page from 'src/components/page';
import Item from 'src/components/item/itemLoan';
import Btn from 'src/components/form/btn';
import { autobind } from 'core-decorators';
import { INDEX_HOME, LOAN_RESULT, LOAN_INDEX } from 'src/constants/urls';
import { userLoanSubmit, loanFaceSubmit } from 'src/actions/loan';
import connect from 'src/decorators/connect';
import { template } from 'lodash';
import { face } from 'src/pages/apply/utils';
import header from 'src/decorators/header';
import popup from 'src/components/modal/popup/protocolOne';
import { close, loadingOne } from 'src/components/modal/toast';
import history, { setBack } from 'src/utils/init/history';
import { getProtocolParam, getProtocolContent } from 'src/pages/protocol/utils';
import { warnLog } from 'src/utils/extend';
import { verifyTradersPwd } from '../utils';
import {
  getAddressInfo, getContactsInfo, getDeviceFingerPrintParams, getInstalledApps, onEvent,
} from '../../../utils/native';
import Com from '../../apply/face/face';
import 'src/pages/protocol/model/index.scss';

@connect(['loan', 'user'], { userLoanSubmit, loanFaceSubmit })
@header()
class Main extends React.Component {
  static _title='Confirm Details'
  state={
    hasError: false,
    contractNo: '',
    loanReqNo: '',
    protocolContent: {},
  }
  async componentDidMount() {
    onEvent('1701');
    setBack(() => {
      setBack(null);
      onEvent('1710');
      history.goBack({
        path: LOAN_INDEX,
      });
    });
    const { agreementParam } = await getProtocolParam();
    const content = await getProtocolContent();
    this.setState({
      protocolContent: {
        agreementParam,
        content,
      },
    });
  }

  @autobind()
  async commit() {
    const {
      history, loan = {}, user = {},
    } = this.props;
    const { loanFace } = this;
    loadingOne();
    const { userIndexSummaryInfo = {} } = user;
    const { applInfo } = userIndexSummaryInfo;
    const { contractNo, applNo } = applInfo;
    const { trailInfo = {}, info, loanInfoToConfrim } = loan;
    const { termPeriod } = loanInfoToConfrim;
    const addressInfo = await getAddressInfo({
      realTime: 'Y',
      isMust: 'Y',
    });
    if (!addressInfo || addressInfo.ERROR_TAG) {
      close();
      return;
    }
    const deviceInfo = await getDeviceFingerPrintParams() || {};
    if (!deviceInfo || deviceInfo.ERROR_TAG) {
      close();
      return;
    }
    let contactsInfo = '';
    let appInfo = '';
    if (trailInfo.crawlFlag === 'Y') {
      contactsInfo = await getContactsInfo({ limit: '0' });
      if (!contactsInfo || contactsInfo.ERROR_TAG) {
        return null;
      }

      appInfo = await getInstalledApps();
      if (!appInfo || appInfo.ERROR_TAG) {
        return null;
      }
    }
    const { contactsList = '' } = contactsInfo;
    const { appList = '' } = appInfo;
    const loanAmt = trailInfo.loanAmt.split(',').join('');
    const params = {
      applNo,
      loanReqNo: trailInfo.loanReqNo,
      contractNo,
      subProductCode: info.subProductCode,
      subProductVer: info.subProductVer,
      rpyType: info.rpyType,
      loanAmt: parseInt(loanAmt).toFixed(2),
      term: info.term,
      termUnit: info.termUnit,
      termPeriod,
      cardId: info.cardId,
      dayRate: trailInfo.dayRate,
      // transPwd,
      creditOrg: trailInfo.creditOrg,
      crawlFlag: trailInfo.crawlFlag || 'N',
      geoInfo: JSON.stringify(addressInfo),
      deviceInfo,
      contactList: contactsList,
      appList,
    };
    const rst = await verifyTradersPwd({
      businessParams: params,
      amount: trailInfo.loanAmt,
    });
    try {
      onEvent('1703', {
        userId: true,
        contact: !contactsInfo.ERROR_TAG ? '允许' : '拒绝',
        contactnum: !contactsInfo.contactCount,
        AppList: !appInfo.ERROR_TAG ? '允许' : '拒绝',
        GPS: !addressInfo.ERROR_TAG ? '允许' : '拒绝',
        device: !deviceInfo.ERROR_TAG ? '允许' : '拒绝',
        result: !rst.ERROR_TAG ? '成功' : '失败',
        failReason: !rst.ERROR_TAG ? '' : rst.msg,
      });
    } catch (e) {
      warnLog(e);
    }
    if (rst) {
      const { faceDetectFlag = 'N', thirdServiceInfo = {} } = rst.data;
      if (faceDetectFlag === 'Y') {
        this.setState({
          thirdServiceInfo,
          loanReqNo: trailInfo.loanReqNo,
          contractNo,
        });
        const faceRst = await loanFace();
        if (!faceRst) return;
      }
      userLoanSubmit(rst);
      history.push(LOAN_RESULT);
    }
    close();
  }
  @autobind()
  async loanFace() {
    const { history, loanFaceSubmit } = this.props;
    const { thirdServiceInfo, loanReqNo, contractNo } = this.state;
    onEvent('1801');
    loadingOne();
    const rst = await face(thirdServiceInfo, { eventId: '1802' });
    onEvent('1803');
    if (!rst) {
      this.setState({
        hasError: true,
      });
      setBack(() => {
        setBack(null);
        this._onBack();
      });
      close();
      return null;
    }
    this.setState({
      hasError: false,
    });
    const { faceImage, faceData } = rst;
    const param = {
      loanReqNo,
      contractNo,
      faceImage,
      faceData,
    };
    const loanRst = await loanFaceSubmit(param);
    close();
    if (!loanRst) return;
    userLoanSubmit(rst);
    history.push(LOAN_RESULT);
  }

  @autobind()
  _onBack() {
    const { history } = this.props;
    history.goBack({
      path: INDEX_HOME,
    });
  }

  @autobind()
  showProtocol() {
    onEvent('1702');
    const { protocolContent } = this.state;
    const { content = '', agreementParam = '' } = protocolContent;
    const closePopup = popup({
      title: 'Loan Agreement',
      mTitle: 'There are some consents about this agreement',
      icon: '',
      children:
  <div className="agreement-content">
    <img src={require('../images/protocol_1.png')} style={{ height: '2.08rem', width: '6.98rem' }} alt="" />
    {(!content && !agreementParam)
      ? (
        <div style={{
          color: '#606166', fontSize: '0.32rem', textAlign: 'center', marginTop: '0.6rem', 
        }}>
          It will be loaded in a few seconds...
        </div>
      )
      : <div dangerouslySetInnerHTML={{ __html: template(content)(agreementParam) }} />}
  </div>,
      onClick: () => {
        closePopup();
        this.commit();
      },
      onClose: () => {
        onEvent('1704');
      },
      btnText: 'Accept And Confirm',
    });
  }
  render() {
    const { loan = {} } = this.props;
    const { trailInfo = {}, loanInfoToConfrim } = loan;
    const { cardNoRears, termPeriod } = loanInfoToConfrim;
    const { showProtocol, loanFace } = this;
    const { hasError } = this.state;
    return (
      <Page>
        {hasError
          ? (<div className="pl52 pr52 pt16 pages-apply-pan-container"><Com face={loanFace} hasError={hasError} /></div>)
          : (
            <div className="height1">
              <div className="mt24 bgcolor6 plr40">
                <Item className="dotb1 pt24 pb24" title="Principal" msg={`₹${trailInfo.principalAmt}`} />
                <Item className="dotb1 pt24 pb24" title="Tenure" msg={`${termPeriod}days`} />
                <Item className="dotb1 pt24 pb24" title="Interest" msg={`₹${trailInfo.interestAmt}`} />
                <Item className="borb1 pt24 pb24" title="Due Date (estimated)" msg={trailInfo.dateDue} />
                <Item
                  className="pt43 pb43 borb5"
                  title={<span className="fcolor1">Payable Amount</span>}
                  msg={(
                    <span className="font40">
                    ₹
                      {trailInfo.payableAmt}
                    </span>
                )} />
              </div>
              <div className="mt24 bgcolor6 plr40">
                <Item className="dotb1 pt24 pb24" title="Loan Amount" msg={`₹${trailInfo.loanAmt}`} />
                <Item className="dotb1 pt24 pb24" title="Processing Fee" msg={<span style={{ color: '#EE1F1F' }}>{`₹${trailInfo.processFee}`}</span>} />
                <Item className="borb1 pt24 pb24" title="Beneficiary A/C" msg={`****${cardNoRears}`} />
                <Item
                  className="pt43 pb43 borb5"
                  title={<span className="fcolor1">Disbursal Amount</span>}
                  msg={(
                    <span className="font40">
                    ₹
                      {trailInfo.disbursalAmt}
                    </span>
                  )} />
              </div>
              <div className="height180" />
              <div className="height180 plr40 pt40 pos-a b0 l0 width-100 bgcolor6">
                <Btn onClick={showProtocol}>
                  <span>Confirm</span>
                </Btn>
              </div>
            </div>
          )
        }

      </Page>
    );
  }
}
export default Main;
