import React from 'react';
import Page from 'src/components/page';
import Item from 'src/components/item/selectItem';
import classnames from 'classnames';
import { getUserLoanListInfo } from 'src/actions/loan';
import { DEFAULT_PRODUCT_CODE } from 'src/constants/index/default';
import { isArray } from 'src/utils/extend';
import connect from 'src/decorators/connect';
import header from 'src/decorators/header';
import login from 'src/decorators/login';
import { choiceRecord, clearLoanList } from '../utils';
import { loadingOne, close } from '../../../components/modal/toast';


const CLSOE_LSIT = {
  PA: { color: 'fcolor14', msg: 'Processing' },
  LF: { color: 'fcolor15', msg: 'Failed' },
  IU: { color: 'fcolor2', msg: 'In-Use' },
  ST: { color: 'fcolor2', msg: 'Settled' },
  LO: { color: 'fcolor15', msg: 'Overdue' },
  PD: { color: 'fcolor16', msg: 'Pending' },
};

@connect(['loan'], { getUserLoanListInfo })
@login()
@header()
class Main extends React.Component {
  static _title='Loan Records'
  async componentDidMount() {
    const { getUserLoanListInfo } = this.props;
    loadingOne();
    await getUserLoanListInfo({ productCode: DEFAULT_PRODUCT_CODE });
    close();
  }
  componentWillUnmount() {
    clearLoanList();
  }

  render() {
    const { loan } = this.props;
    const { list = [] } = loan;

    return (
      <Page className="pt24">
        <div className="bgcolor6">
          { list && !isArray(list)
            ? (
              <div className="t-center bgcolor11 pt256" style={{ lineHeight: 0 }}>
                <img className="ilbl width100 height112 mb22" src={require('../images/no-record.png')} alt="" />
                <span className="bl fcolor2 font34">No record</span>
              </div>
            )
            : list.map((item, index) => (
              <Item
                key={index}
                onClick={() => {
                  choiceRecord(item);
                }}
                className={classnames('pt42 pb47', index >= list.length - 1 ? 'borb5' : '')}
                title={(
                  <div>
                    <p className="lh53 fw6 rmed font38">{`₹ ${item.loanAmt}`}</p>
                    <p className="lh32 fcolor2 font26">{item.dateLoan}</p>
                  </div>
                      )}
                msg={<p className={classnames('rblod fw6 lh32 font28', CLSOE_LSIT[item.loanState].color)}>{CLSOE_LSIT[item.loanState].msg}</p>} />
            ))
          }
        </div>
      </Page>
    );
  }
}

export default Main;
