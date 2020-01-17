import React from 'react';
import Page from 'src/components/page';
import Item from 'src/components/item/itemLoan';
import Btn from 'src/components/form/btn';
import connect from '../../../decorators/connect';
import header from '../../../decorators/header';
import { INDEX_HOME, REPAY_RESULT } from '../../../constants/urls';
import { pay } from '../utils';
import { onEvent } from '../../../utils/native';
import history, { setBack } from '../../../utils/init/history';
import { warnLog } from '../../../utils/extend';

@connect(['repayment'], { })
@header()
class Main extends React.Component {
  static _title='Repay'
  componentDidMount() {
    onEvent('2001');
    setBack(() => {
      setBack(null);
      onEvent('2003');
      history.goBack({
        path: INDEX_HOME,
      });
    });
  }

  render() {
    const { history, repayment = {} } = this.props;
    const {
      payableAmt, principalAmt, interestAmt, penaltyInterest, overdueDays,
      processFee, thirdPayName, loanReqNo,
    } = repayment.trailInfo || {};
    return (
      <Page className="pt24">
        <div className="plr40 bgcolor6">
          <p className="rbold fw1 flh74 font52 pt46 t-center">{`₹${payableAmt}`}</p>
          <p className="lh33 t-center" style={{ marginTop: '.08rem', marginBottom: '.23rem' }}>Payable Amount</p>
          <Item className="dotb1 pt34 pb32" title="Principal" msg={`₹${principalAmt}`} />
          <Item className="dotb1 pt34 pb32" title="Interest" msg={`₹${interestAmt}`} />
          <Item className="dotb1 pt34 pb32" title={`Penalty (${overdueDays} days overdue)`} msg={`₹${penaltyInterest}`} />
          <Item className="pt34 pb32" title="Convenience Fee" msg={`₹${processFee}`} />
        </div>
        <div className="height180" />
        <div className="height180 plr40 pt40 pos-a b0 l0 width-100 bgcolor6">
          <Btn onClick={async () => {
            const firstTime = new Date().getTime();
            const rst = await pay({
              loanReqNo,
              thirdPayName,
            });
            const secondesTime = new Date().getTime();
            try {
              onEvent('2002', {
                operationTime: ((secondesTime - firstTime) / 1000).toFixed(0),
                result: !rst.ERROR_TAG ? '成功' : '失败',
                failReason: !rst.ERROR_TAG ? '' : rst.msg,
              });
            } catch (e) {
              warnLog(e);
            }
            setTimeout(() => {
              if (rst) history.push(`${REPAY_RESULT}/${rst}`);
            }, 1500);
          }}>
            <span>Pay Now</span>
          </Btn>
        </div>
      </Page>
    );
  }
}

export default Main;
