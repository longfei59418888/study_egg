/**
 * 360loan-india 借款
 * @author Xiaolong
 */
import React from 'react';
import header from 'src/decorators/header';
import Page from 'src/components/page';
import '../../index.scss';
import Safe from 'src/components/tips/safeTip';
import BInput from 'src/components/form/input';
import Btn from 'src/components/form/btn';
import { autobind } from 'core-decorators';
import connect from 'src/decorators/connect';
import { infoOne, loadingOne, close } from 'src/components/modal/toast';
import { addCardInfo, getCardListInfo } from 'src/actions/user';
import { onEvent } from '../../../../utils/native';
import history, { setBack } from '../../../../utils/init/history';
import { warnLog } from '../../../../utils/extend';

@connect([''], { getCardListInfo })
@header()
class Main extends React.Component {
  state = {
    bank: '',
    bankError: '',
    ifsc: '',
    ifscError: '',
  }
  componentWillMount() {
  }

  componentDidMount() {
    onEvent('1601');
    setBack(() => {
      setBack(null);
      onEvent('1605', { userId: true });
      history.goBack();
    });
  }

  @autobind()
  unBlur(value, type) {
    if (type) {
      let bankError = '';
      if (value.length > 0 && !/^\d{9,18}$/.test(value)) {
        bankError = 'Please enter valid back account number';
      }
      this.setState({
        bankError,
        bank: value,
      });
      onEvent('1602', { userId: true, onblur: 1 });
    } else {
      let ifscError = '';
      if (value.length > 0 && !/^[0-9a-zA-Z]{11}$/.test(value)) {
        ifscError = 'Please enter valid IFSC Code';
      }
      this.setState({
        ifscError,
        ifsc: value,
      });
      onEvent('1603', { userId: true, onblur: 1 });
    }
  }

  @autobind()
  async submit() {
    const { history, getCardListInfo } = this.props;
    const {
      bank, ifsc, bankError, ifscError, 
    } = this.state;
    const { unBlur } = this;
    await unBlur(ifsc || ' ', 0);
    await unBlur(bank || ' ', 1);
    if (bankError || ifscError) {
      infoOne(bankError || ifscError || '');
      return; 
    }
    if (!bank || !ifsc) return;

    loadingOne();
    const rst = await addCardInfo({
      ifscCode: ifsc,
      cardNo: bank,
      cardType: 'A',
      bindSource: 'L',
    });
    try {
      onEvent('1604', {
        userId: true,
        result: rst.ERROR_TAG ? '失败' : '成功',
        failReason: rst.ERROR_TAG ? rst.msg : '',
      });
    } catch (e) {
      warnLog(e);
    }
    if (rst) {
      const { state, failMsg } = rst;
      if (state === 'S') {
        await getCardListInfo();
        history.goBack();
      } else {
        infoOne(failMsg);
      }
    }
    close();
  }


  render() {
    const { bankError, ifscError } = this.state;
    return (
      <Page className="pl52 pr52 pt16 pages-apply-pan-container pos-r" style={{ minHeight: '100%' }}>
        <p className="rbold font56 lh66 fcolor1 fw1 nowrap">Bank Transfer Details</p>
        <p className="mt30 fcolor3 flh42 font32 rreg">In order to ensure that you can recieve your loan funds timely, please fill in details of valid bank account in your name.</p>
        <p className="font34 lh42" style={{ marginTop: '.9rem' }}>Bank Account Number</p>
        <div className="mt38" style={{ marginTop: '.38rem' }}>
          <BInput
            unBlur={(value) => {
              this.unBlur(value, 1);
            }}
            placeholder="Please fill in Bank Account No"
            icon={require('../../images/bank_2.png')} />
          <div style={{ height: 0, overflow: 'hidden' }}>{ifscError + bankError}</div>
          <div className="lh32 font26 fcolor10 pl70 mt10">{bankError}</div>
        </div>

        <p className="font34 lh42" style={{ marginTop: '.39rem' }}>IFSC Code</p>
        <div className="mt38" style={{ marginTop: '.38rem' }}>
          <BInput
            unBlur={(value) => {
              this.unBlur(value, 0);
            }}
            placeholder="Please fill in IFSC Code"
            icon={require('../../images/bank_1.png')} />
          <p className="lh32 font26 fcolor10 pl70 mt10">{ifscError}</p>
        </div>
        <div className="b21 height70" />
        <Safe style={{ bottom: '2.1rem', transform: 'scale(.85)', WebkitTransform: 'scale(.85)' }} />
        <div className="height180" />
        <div className="height180 plr40 pt40 pos-a b0 l0 width-100 bgcolor6 zindex3">
          <Btn onClick={() => {
            this.submit();
          }}>
          Submit
          </Btn>
        </div>
      </Page>
    );
  }
}

export default Main;
