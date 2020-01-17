/**
 * profile
 * @author Xiaolong
 */
import React from 'react';
import '../index.scss';
import header from 'src/decorators/header';
import Page from 'src/components/page';
import { autobind } from 'core-decorators';
import popup from 'src/components/modal/popup';
import protocolOne from 'src/components/modal/popup/protocolOne';
import Item from 'src/components/item/selectItem';
import Btn from 'src/components/form/btn';
import { APPLY_RESULT } from 'src/constants/urls';
import { infoOne, loadingOne, close } from 'src/components/modal/toast';
import {
  getContactsInfo, getAddressInfo, onEvent, getDeviceFingerPrintParams, 
} from 'src/utils/native';
import { contactPhone, warnLog } from 'src/utils/extend';
import classNames from 'classnames';
import connect from '../../../decorators/connect';
import { itemCommit } from '../../../actions/apply';
import { onBackOne, getExtraInfo } from '../utils';

@connect(['apply'], {
  itemCommit,
})
@header()
class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      relativeName: '',
      relativeRelationship: '',
      relativeTelNo: '',
      friendName: '',
      friendRelationship: '',
      friendTelNo: '',
      canSubmit: '',
    };
  }
  componentDidMount() {
    onBackOne({ resourcePage: '添加联系人' });
    onEvent('1101');
  }

  @autobind()
  selectInfo(arr, name) {
    const showSelect = popup((
      <div>
        <p className="width-100 t-center rbold fw1 font28 fcolor1 lh88">
          <span>Select relation type</span>
          <img className="width46 height46 right mt22 mr38" onClick={() => { showSelect(); }} src={require('../images/close.png')} alt="" />
        </p>
        {arr.map((item, index) => (
          <p
            key={index}
            onClick={() => {
              this.setState({
                [name]: item,
              });
              onEvent('1103', {
                Type: item,
              });
              showSelect();
            }}
            className="flex pt34 pb34 borb1 flex-center fcolor7 font32">
            {item}
          </p>
        ))}
      </div>
    ), {});
  }

  @autobind()
  async selectPhone(name, tel) {
    const rst = await getContactsInfo({ limit: '-1' });
    if (!rst) return;
    const { contactInfo = {} } = rst;
    const { relativeTelNo, friendTelNo } = this.state;
    const { phone } = contactInfo;
    if (!contactPhone(phone)) {
      infoOne('Please select valid contact and mobile number', true);
      this.setState({
        canSubmit: '',
      });
      return;
    }
    if (relativeTelNo === contactInfo.phone || friendTelNo === contactInfo.phone) {
      infoOne('This contact has been selected. Please select another one.', true);
      this.setState({
        canSubmit: '',
      });
      return;
    }
    this.setState({
      [name]: contactInfo.name || '',
      [tel]: contactInfo.phone || '',
    });
    setTimeout(() => {
      const {
        relativeName, relativeTelNo, friendName, friendTelNo, 
      } = this.state;
      if (relativeName && relativeTelNo && friendName && friendTelNo) {
        this.setState({
          canSubmit: 'can',
        });
      }
    });
  }

  @autobind()
  async commmit() {
    const { canSubmit } = this.state;
    if (!canSubmit) return;
    const { history, itemCommit } = this.props;
    loadingOne();
    const deviceInfo = await getDeviceFingerPrintParams() || {};
    const fileMap = await getExtraInfo();
    if (!fileMap) {
      close();
      return;
    }
    const addressInfo = await getAddressInfo({
      realTime: 'Y',
      isMust: 'Y',
    });
    if (!addressInfo || addressInfo.ERROR_TAG) {
      close();
      return;
    }
    const geoInfo = addressInfo || {};
    const rst = await itemCommit(this.state, {}, {
      geoInfo: JSON.stringify(geoInfo),
      fileMap,
    });
    try {
      onEvent('1105', {
        device: !deviceInfo.ERROR_TAG ? '允许' : '拒绝',
        GPS: !addressInfo.ERROR_TAG ? '允许' : '拒绝',
        AppList: !fileMap ? '拒绝' : '允许',
        result: !rst.ERROR_TAG ? '成功' : '失败',
        failReason: !rst.ERROR_TAG ? rst.msg : '',
      });
    } catch (e) {
      warnLog(e);
    }
    onEvent('af_level_achieved', {
      reportAF: 'Y',
    });
    close();
    if (rst) history.push(APPLY_RESULT);
  }
  
  @autobind()
  showProtocol() {
    onEvent('1104');
    const stateKey = Object.keys(this.state);
    const { state, commmit } = this;
    const isValid = stateKey.every(item => state[item].length > 0);
    if (!isValid) {
      infoOne('Please select contact and relationship', true);
      return;
    }
    protocolOne({
      title: <span className="font50 ell"> Permissions & Consents </span>,
      icon: '',
      children:
  <div>
    <img src={require('../images/protocol1.png')} alt="" />
            I hereby authorize 360Loan, to request and receive my credit score (“CIR”) from Equifax.
            I fully understand that the purpose of this CIR is to enable me to make informed lending decisions effectively and enable faster processing of credit applications to help provide speedier access of credit to me facilitated through the 360Loan.
            I further understand that 360Loan may apply for the CIR by themselves or through any of their partner tie-ups who are members of CIC, and I fully authorize 360Loan to share my details with such lending partner.
            By clicking on accept and agree, I also hereby consent to receiving communications including but not limited to SMS, e-mails, phone calls from 360Loan with respect to my transactions on the Application or for any other purpose.
            This consent will override any registration for DNC/NDNC requirement.
  </div>,
      onClick: commmit,
      btnText: 'Accept And Confirm',
    });
  }
  render() {
    const {
      relativeName, relativeRelationship, relativeTelNo, friendName, friendRelationship, friendTelNo, canSubmit,
    } = this.state;
    const { selectInfo, showProtocol, selectPhone } = this;
    return (
      <Page className="pt16 pages-apply-pan-container">
        <div className="pl52 pr38">
          <p className="rbold font56 lh66 fcolor1 fw1 nowrap"><span>Reference Contacts</span></p>
          <p className="mt30 fcolor3 flh42 font32 rreg">Please select your reference contacts, they would not be reached out in normal situations</p>
        </div>
        <p className="bgcolor11 height70 lh42 font35 rbold sfbold flex flex-ali-center plr52 mt44 fw1 pt12">Relative</p>
        <Item
          onClick={() => {
            selectInfo(['Father', 'Mother', 'Spouse', 'Children', 'Sibling'], 'relativeRelationship');
          }}
          className="pt58 pb58"
          title="Relationship"
          msg={relativeRelationship ? <span className="fcolor9">{relativeRelationship}</span> : 'select relation type'} />
        <Item
          onClick={() => {
            selectPhone('relativeName', 'relativeTelNo');
          }}
          className="pt58 pb58 "
          title="Contact Name"
          msg={relativeName ? <span className="fcolor9">{relativeName}</span> : 'select from addressbook'} />
        {relativeTelNo && <Item className="pt58 pb58 borb5" title="Phone Number" msg={<span className="fcolor9">{relativeTelNo}</span>} hasIcon={0} />}
        <p className="bgcolor11 height70 lh42 font35 rbold sfbold flex flex-ali-center plr52 fw1 pt12">Friend</p>
        <Item
          onClick={() => {
            selectInfo(['Schoolmate', 'Colleague', 'Friend'], 'friendRelationship');
          }}
          className="pt58 pb58"
          title="Relationship"
          msg={friendRelationship ? <span className="fcolor9">{friendRelationship}</span> : 'select relation type'} />
        <Item
          onClick={() => {
            selectPhone('friendName', 'friendTelNo');
          }}
          className="pt58 pb58 borbtop1"
          title="Contact Name"
          msg={friendName ? <span className="fcolor9">{friendName}</span> : 'select from addressbook'} />
        {friendTelNo && <Item className="pt58 pb58 borb5" title="Phone Number" msg={<span className="fcolor9">{friendTelNo}</span>} hasIcon={0} />}
        <div style={{ height: '2.2rem' }} />
        <div className="pos-f width-100 l0 b0 sha2 pt40 plr40 bgcolor6 zindex9" style={{ height: '1.8rem' }}>
          <Btn
            onClick={showProtocol}
            className={classNames('', {
              bgcolor12: !canSubmit, nosha: !canSubmit,
            })}>
            <span>Next</span>
          </Btn>
        </div>
      </Page>
    );
  }
}


export default Main;
