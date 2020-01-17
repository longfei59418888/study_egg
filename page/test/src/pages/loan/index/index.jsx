/**
 * 360loan-india 借款
 * @author Xiaolong
 */
import React from 'react';
import header, { TYPE_CENTER } from 'src/decorators/header';
import connect from 'src/decorators/connect';
import { autobind } from 'core-decorators';
import Page from 'src/components/page';
import classnames from 'classnames';
import Btn from 'src/components/form/btn';
import Item from 'src/components/item/selectItem';
import { userLoanPreCheck, userLoanTrail, setLoanData } from 'src/actions/loan';
import { setCardListInfo } from 'src/actions/user';
import { INDEX_HOME, LOAN_ADD_BANK, LOAN_CONFIRM } from 'src/constants/urls';
import { infoOne, loadingOne, close } from 'src/components/modal/toast';
import popup from '../../../components/modal/popup';
import InItem from './inputItem';
import '../index.scss';
import { onEvent } from '../../../utils/native';
import history, { setBack } from '../../../utils/init/history';
import { loanInfoToConfirm } from '../utils';
import { warnLog } from '../../../utils/extend';

@connect(['user', 'loan'], {
  userLoanPreCheck, setCardListInfo, userLoanTrail, setLoanData,
})
@header(TYPE_CENTER)
class Main extends React.Component {
  static _title='Apply Loan'
  state = {
    indexItem: 1,
  }
  async componentWillMount() {
    const { loan, userLoanPreCheck, user = {} } = this.props;
    const { loanInfoToConfrim = {} } = loan;
    const { selectedTermPeriod = 1 } = loanInfoToConfrim;
    const { applInfo } = user.userIndexSummaryInfo;
    this.setState({
      indexItem: selectedTermPeriod || 0,
    });
    loadingOne();
    const { applNo, contractNo } = applInfo;
    await userLoanPreCheck({
      applNo,
      contractNo,
    });
    close();
  }
  componentDidMount() {
    onEvent('1501');
    setBack(() => {
      setBack(null);
      onEvent('1507');
      history.goBack({
        path: INDEX_HOME,
      });
    });
  }

  @autobind()
  errorInfo() {
    const { loan = {} } = this.props;
    const { subProducts = [] } = loan.preCheckInfo;
    const { maxLoanAmt, minLoanAmt, stepAmt } = subProducts[0] || {};
    return {
      1: `₹${minLoanAmt} is the minimum amount`,
      2: `₹${maxLoanAmt} is the maximum amount`,
      3: `The amount must be an integral multiple of ₹${stepAmt}`,
      4: 'Please enter the amount',
      5: 'Please select your bank account',
    };
  }

  @autobind()
  showBank() {
    const {
      history, user, setCardListInfo, loan = {}, 
    } = this.props;
    const { userCardInfo = [] } = user;
    const { cardNumCap = 5 } = loan.preCheckInfo;
    onEvent('1504');

    const closePopup = popup((
      <div className="t-left">
        <div className="height138 flex-ali-center plr52 borb1">
          <p className="flex1 fw1 fcolor1">Select Beneficiary Account</p>
          <p className="width50" onClick={() => { closePopup(); onEvent('15040103'); }}><img src={require('../images/loan-3.png')} alt="" /></p>
        </div>
        <div className="plr52">
          {userCardInfo.map((item, index) => (
            <div
              onClick={() => {
                userCardInfo.forEach((info) => { info.loanFlag = 'N'; });
                userCardInfo[index].loanFlag = 'Y';
                setCardListInfo(userCardInfo);
                closePopup();
                onEvent('15040101');
              }}
              key={index}
              className="height119 flex-ali-center borb1">
              <p className="flex1 fcolor1">{`****${item.cardNoRears} (${item.ifscCode})`}</p>
              <p className="width50">{item.loanFlag === 'Y' && <img src={require('../images/loan-1.png')} alt="" />}</p>
            </div>
          ))}
          <div
            onClick={() => {
              if (userCardInfo.length >= cardNumCap) {
                infoOne('5 linked bank accounts at most, no more bank account can be added.', true);
                return;
              }
              onEvent('15040102');
              setTimeout(() => {
                history.push(LOAN_ADD_BANK);
              }, 200);
            }}
            className="height119 flex-ali-center  borb1">
            <img className="width34" src={require('../images/loan-2.png')} alt="" />
            <span className="ilbl pl14 fcolor7 font32">Add New Account</span>
          </div>
        </div>
      </div>
    ));
  }

  @autobind()
  async checkLoanInfo() {
    const { input } = this.input;
    const { value } = input;
    const { indexItem } = this.state;
    loadingOne();
    const {
      history, userLoanTrail, loan = {}, user = {}, 
    } = this.props;
    const { subProducts = [], loanReqNo } = loan.preCheckInfo;
    const { userIndexSummaryInfo = {}, userCardInfo = [] } = user;
    const { applInfo } = userIndexSummaryInfo;
    const { contractNo } = applInfo;
    const {
      maxLoanAmt, minLoanAmt, stepAmt = 1000, repayTypes = [],
      subProductCode, subProductVer,
    } = subProducts[0] || {};
    const bank = userCardInfo.some(item => item.loanFlag === 'Y');
    const ERROR_LIST = this.errorInfo();
    let error = 0;
    if (!bank) error = 5;
    if (value.length === 0) error = 4;
    if (value.length > 0 && value < parseFloat(minLoanAmt)) error = 1;
    if (value.length > 0 && value > parseFloat(maxLoanAmt)) error = 2;
    if (value.length > 0 && value % stepAmt !== 0) error = 3;
    if (error) {
      infoOne(ERROR_LIST[error], true);
      return;
    }
    const {
      rpyType, term, termPeriod, termUnit,
    } = repayTypes[indexItem];
    let cardInfo = {};
    userCardInfo.forEach((item) => {
      if (item.loanFlag === 'Y') cardInfo = item;
    });
    const rst = await userLoanTrail({
      contractNo,
      loanReqNo,
      loanAmt: parseInt(value).toFixed(2),
      rpyType,
      subProductCode,
      subProductVer,
      cardId: cardInfo.cardId,
      term,
      termUnit,
      termPeriod,
    });
    if (bank) {
      const { cardNoRears } = cardInfo;
      const data = {
        cardNoRears,
        termPeriod,
        selectedTermPeriod: indexItem,
        loanAmt: parseInt(value).toFixed(2),
      };
      loanInfoToConfirm(data);
    }
    try {
      onEvent('1506', {
        result: !rst.ERROR_TAG ? '成功' : '失败',
        failReason: !rst.ERROR_TAG ? '' : rst.msg,
      });
    } catch (e) {
      warnLog(e);
    }
    if (rst) history.push(LOAN_CONFIRM);
    close();
  }

  render() {
    const { loan = {}, user } = this.props;
    const { loanInfoToConfrim = {}, preCheckInfo } = loan;
    const { subProducts = [] } = preCheckInfo;
    const { loanAmt = '' } = loanInfoToConfrim;
    const {
      maxLoanAmt, minLoanAmt, stepAmt = 1000, repayTypes = [], 
    } = subProducts[0] || {};
    const { indexItem } = this.state;
    const { showBank, errorInfo, checkLoanInfo } = this;
    const error = errorInfo();
    const { userCardInfo = [] } = user;
    let bank = null;
    userCardInfo.forEach((item) => {
      if (item.loanFlag === 'Y') bank = item;
    });
    return (
      <Page>
        <InItem ref={(ref) => { this.input = ref; }} min={minLoanAmt} max={maxLoanAmt} stepAmt={stepAmt} error={error} defaultValue={loanAmt} />
        <div className="mt24 plr50 bgcolor6 pt50 pb44">
          <p className="lh30 rmed fw5 font30">Loan Tenure</p>
          <div className="pt40 flex pb45" style={{ margin: '0 -.21rem' }}>
            {repayTypes.map((item, index) => (
              <div
                onClick={() => {
                  this.setState({ indexItem: index });
                  onEvent('1505', { tenure: item });
                }}
                key={index}
                className="flex1 plr11 t-center rbold fw1">
                <div className={classnames('flex-center height200 rad8', indexItem !== index ? 'fcolor1 sha4 pages-loan-index-item' : 'fcolor6 sha5 bgcolor7')}>
                  <div>
                    <p className="lh61 font52">{item.termPeriod}</p>
                    <p className="lh33 font28" style={{ marginTop: '0.06rem' }}> Days</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt24 bgcolor6 ">
          <Item
            onClick={() => {
              showBank();
            }}
            title="Beneficiary A/C"
            msg={<span style={{ color: '#1B1B4E' }}>{(bank && `${bank.ifscCode} (${bank.cardNoRears})`) || <span className="fcolor3">Add Bank Account</span>}</span>}
            className="pt50 pb50 fcolor1" />
        </div>
        <div className="height180" />
        <div className="height180 plr40 pt40 pos-a b0 l0 width-100 bgcolor6">
          <Btn onClick={checkLoanInfo}>
            <span>Get It Now</span>
          </Btn>
        </div>
      </Page>
    );
  }
}

export default Main;
