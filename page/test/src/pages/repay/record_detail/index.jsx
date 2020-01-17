import React from 'react';
import Page from 'src/components/page';
import classnames from 'classnames';
import Item from 'src/components/item/itemLoan';
import { getUserListDetail } from 'src/actions/loan';
import { autobind } from 'core-decorators';
import connect from 'src/decorators/connect';
import header from 'src/decorators/header';
import { isEmptyObject } from 'src/utils/extend';
import { getAgreementNo, clearLoanRecord } from '../utils';
import { loadingOne, close } from '../../../components/modal/toast';

const STATUS_LIST = {
  1: {
    icon: require('../images/status-1.png'), color: 'fcolor14', text: 'Processing', itemText: '',
  },
  2: {
    icon: require('../images/status-2.png'), color: 'fcolor15', text: 'Failed', itemText: '',
  },
  3: {
    icon: require('../images/status-3.png'), color: 'fcolor14', text: 'In-Use', itemText: '',
  },
  4: {
    icon: require('../images/status-2.png'), color: 'fcolor15', text: 'Overdue', itemText: '',
  },
  5: {
    icon: require('../images/status-5.png'), color: 'fcolor16', text: 'Pending', itemText: '',
  },
  6: {
    icon: require('../images/status-4.png'), color: 'fcolor14', text: 'Settled', itemText: '',
  },

};

@connect(['loan'], { getUserListDetail })
@header()
class Main extends React.Component {
  static _title='Loan Details'
  async componentWillMount() {
    const { loan, getUserListDetail } = this.props;
    const { choiceRecord } = loan;
    loadingOne();
    await getUserListDetail(choiceRecord);
    close();
  }
  componentWillUnmount() {
    clearLoanRecord();
  }

  @autobind()
  getRecordDetail() {
    const { loan } = this.props;
    const { detail = {} } = loan;
    if (!detail) return;
    const {
      loanAmt, dateLoan, cardNoRears, bankAbbreviation, repaymentAmt,
      disbursalAmt, dayRate, processFee, interestAmt, payableAmt, termPeriod,
      overdueDays, penaltyInterest, agreementNo, loanState, dateInst, dateDue,
      // loanReqNo, failedReason, dateSettle
    } = detail;
    let contentList = {};
    switch (loanState) {
      case 'PA':
        contentList = {
          ...STATUS_LIST[1],
          ...{
            firstItems: {
              'Loan Amount（Principal）': `₹${loanAmt}`, Tenure: `${termPeriod} days`, 'Daily Interest Rate': dayRate, Interest: `₹${interestAmt}`, 'Processing Fee': `₹${processFee}`, 'Disbursal Amount': `₹${disbursalAmt}`,
            },
            secondItems: {
              'Payable Amount': `₹${payableAmt}`, 'Beneficiary A/C': `****${cardNoRears}`, 'IFSC Code': bankAbbreviation, 'Time of Application': dateLoan,
            },
          },
        };
        break;
      case 'LF':
        contentList = {
          ...STATUS_LIST[2],
          ...{
            firstItems: {
              'Loan Amount（Principal）': `₹${loanAmt}`, Tenure: `${termPeriod} days`, 'Daily Interest Rate': dayRate,
            },
            secondItems: {
              'Beneficiary A/C': `****${cardNoRears}`, 'IFSC Code': bankAbbreviation, 'Time of Application': dateLoan,
            },
          },
        };
        break;
      case 'IU':
        contentList = {
          ...STATUS_LIST[3],
          ...{
            firstItems: {
              'Loan Amount（Principal）': `₹${loanAmt}`, Tenure: `${termPeriod} days`, From: dateInst, To: dateDue, 'Daily Interest Rate': dayRate, Interest: `₹${interestAmt}`, 'Processing Fee': `₹${processFee}`, 'Disbursal Amount': `₹${disbursalAmt}`,
            },
            secondItems: {
              'Payable Amount': `₹${payableAmt}`, 'Beneficiary A/C': `****${cardNoRears}`, 'IFSC Code': bankAbbreviation, 'Time of Application': dateLoan, 'Loan Agreement': agreementNo,
            },
          },
        };
        break;
      case 'LO':
        contentList = {
          ...STATUS_LIST[4],
          ...{
            firstItems: {
              'Payable Amount': `₹${payableAmt}`, Overdue: `${overdueDays} days`, Interest: `₹${interestAmt}`, Penalty: `₹${penaltyInterest}`, 'Processing Fee': `₹${processFee}`,
            },
            secondItems: {
              'Disbursal Amount': `₹${disbursalAmt}`, 'Loan Amount（Principal）': `₹${loanAmt}`, From: dateInst, To: dateDue, 'Daily Interest Rate': dayRate, 'Beneficiary A/C': `****${cardNoRears}`, 'IFSC Code': bankAbbreviation, 'Time of Application': dateLoan, 'Loan Agreement': agreementNo,
            },
          },
        };
        break;
      case 'PD':
        contentList = {
          ...STATUS_LIST[5],
          ...{
            firstItems: {
              'Payment Amount': `₹${repaymentAmt}`, 'Payable Amount': `₹${payableAmt}`, Overdue: `${overdueDays} days`, Penalty: `₹${penaltyInterest}`, Interest: `₹${interestAmt}`, 'Processing Fee': `₹${processFee}`, 'Disbursal Amount': `₹${disbursalAmt}`,
            },
            secondItems: {
              'Loan Amount（Principal）': `₹${loanAmt}`, Tenure: `${termPeriod} days`, From: dateInst, To: dateDue, 'Disbursal Amount': `₹${disbursalAmt}`, 'Beneficiary A/C': `****${cardNoRears}`, 'IFSC Code': bankAbbreviation, 'Daily Interest Rate': dayRate, 'Time of Application': dateLoan, 'Loan Agreement': agreementNo,
            },
          },
        };
        break;
      case 'ST':
        contentList = {
          ...STATUS_LIST[6],
          ...{
            firstItems: {
              'Payable Amount': `₹${payableAmt}`, 'Repayment Amount': `₹${repaymentAmt}`, Overdue: `${overdueDays} days`, Penalty: `₹${penaltyInterest}`, Interest: `₹${interestAmt}`, 'Processing Fee': `₹${processFee}`, 'Disbursal Amount': `₹${disbursalAmt}`,
            },
            secondItems: {
              'Loan Amount（Principal）': `₹${loanAmt}`, From: dateInst, To: dateDue, Tenure: `${termPeriod} days`, 'Beneficiary A/C': `****${cardNoRears}`, 'IFSC Code': bankAbbreviation, 'Daily Interest Rate': dayRate, 'Time of Application': dateLoan, ' Loan Agreement': agreementNo,
            },
          },
        };
        break;
      default:
        // contentList = {
        //   ...{
        //     firstItems: {},
        //     secondItems: {},
        //   },
        // };
        break;
    }
    return contentList;
  }

  render() {
    const contentList = this.getRecordDetail();
    const { loan } = this.props;
    const { detail = {} } = loan;
    const { agreementNo } = detail;
    const {
      firstItems = {}, secondItems = {}, icon, text, color,
    } = contentList;
    return (
      <Page className="pt24">
        {contentList ? (
          <div>
            {!isEmptyObject(firstItems) ? (
              <div className="bgcolor6 t-center pt50 ">
                <img src={icon} alt="" className="height110 width110 ilbl " />
                <p className={classnames('rmed fw5 lh44 font38 mt20', color)}>{text}</p>
                <div className="plr40" style={{ paddingTop: '.26rem' }}>
                  {Object.keys(firstItems).map((event, index) => (
                    <Item
                      key={index}
                      className={classnames('pt23 pb24', index >= Object.keys(firstItems).length - 1 ? '' : 'dotb1')}
                      title={index !== 0 ? event : <span className="fcolor1">{event}</span>}
                      msg={index !== 0 ? firstItems[event] : <span className="font52">{firstItems[event]}</span>} />
                  ))}
                </div>
              </div>
            ) : ''}
            <div className="plr40 mt24 bgcolor6">
              {Object.keys(secondItems).map((event, index) => (
                <Item key={index} className={classnames('pt23 pb24', index >= Object.keys(secondItems).length - 1 ? '' : 'dotb1')} title={event} msg={event.replace(/\s+/g, '') !== 'LoanAgreement' ? secondItems[event] : <View agreementNo={agreementNo} />} />
              ))}
            </div>
          </div>
        )
          : ''}
        <div className="height1 mt24" />
      </Page>
    );
  }
}

function View(param) {
  return (
    <div onClick={() => {
      getAgreementNo(param);
    }}>
      <span className="fcolor1 font28 ilbl v-middle mr12">View</span>
      <img className="ilbl width26 height26 v-middle" src={require('../images/arrow.png')} alt="" />
    </div>
  );
}
export default Main;
