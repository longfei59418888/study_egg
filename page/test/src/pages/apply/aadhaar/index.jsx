/**
 * aadhaar
 * @author Xiaolong
 */
import React from 'react';
import '../index.scss';
import header from 'src/decorators/header';
import Page from 'src/components/page';
import Safe from 'src/components/tips/safeTip';
import { autobind } from 'core-decorators';
import popup from 'src/components/modal/popup';
import Item from 'src/components/item/panItem';
import Btn from 'src/components/form/btn';
import { USER_APPLY_NODE_MAP } from 'src/constants/urls';
import { oneConfirm, oneError } from 'src/components/modal/confirm';
import { getStoreState } from 'src/store';
import {
  onBackOne, addhaarOcr, setNodeInfo, upLoadImage, paramsNativeRsa,
} from '../utils';
import connect from '../../../decorators/connect';
import { itemCommit } from '../../../actions/apply';
import { close, infoOne, loadingOne } from '../../../components/modal/toast';
import { onEvent } from '../../../utils/native';
import { warnLog } from '../../../utils/extend';

@connect(['apply'], { itemCommit })
@header()
class Main extends React.Component {
  static _right = [
    {
      text: <Right />,
      onClick: 'skipStep',
    },
  ]
  state={
    reportId: '',
    aadhaarNo: '',
    realName: '',
    birthDate: '',
    gender: '',
    skipFlag: 'N',
    address: '',
    ocrData: '',
    fFileId: '',
    bFileId: '',
  }
  componentDidMount() {
    onBackOne({ eventId: '0705', resourcePage: 'aadhaar' });
    onEvent('0701');
  }
  @autobind()
  skipStep() {
    const { confirm } = this;
    oneConfirm({
      title: <span className="font38">Are you sure to Skip?</span>,
      msg: 'Your credit application might be rejected or approved with low credit line.',
      okText: 'No, return',
      cancelText: 'Yes, skip',
      ok: () => {
        onEvent('0704', {
          userId: false,
          cancel: '取消',
        });
      },
      cancel: (() => {
        this.setState({
          skipFlag: 'Y',
        });
        onEvent('0704', {
          userId: false,
          cancel: '跳过',
        });
        setTimeout(() => confirm(), 0);
      }),
    });
  }

  @autobind()
  async aadhaar(param) {
    loadingOne();
    const { entrance = '' } = param;
    const { props, showInfo } = this;
    const { nodeStepInfo = {} } = props.apply;
    const firstTime = new Date().getTime();
    const rst = await addhaarOcr(nodeStepInfo.thirdServiceInfo);
    const secondesTime = new Date().getTime();
    setTimeout(() => close(), 0);
    try {
      onEvent('0702', {
        userId: true,
        Camera: '允许',
        operationTime: ((secondesTime - firstTime) / 1000).toFixed(0),
        result: !rst.ERROR_TAG ? '成功' : '失败',
        failReason: !rst.ERROR_TAG ? '' : rst.msg || rst.data.scanResult,
        entrance: entrance || 'Aadhaar页面',
      });
    } catch (e) {
      warnLog(e);
    }
    if (rst && rst.ERROR_TAG) {
      if (rst.flag === 'C') return;
      if (rst.data && rst.data.scanResult) {
        const { status, comment, data = {} } = JSON.parse(rst.data.scanResult || {});
        if (status === 210) {
          const { aadress } = data;
          return infoOne(aadress);
        }
        infoOne(comment);
      } else {
        infoOne(rst.msg || '');
      }
    } else {
      const scanResult = JSON.parse(rst.scanResult || {});
      const { data } = scanResult;
      const { fileAFId = '', fileABId = '' } = JSON.parse(rst.imageMap);
      this.setState({
        reportId: scanResult.report_id,
        aadhaarNo: data.aadhaar_no,
        realName: data.user_name,
        birthDate: data.date_of_birth || '',
        yearDate: data.year_of_birth || '',
        gender: data.gender,
        fFileId: fileAFId,
        bFileId: fileABId,
        address: data.aadress,
        ocrData: data,
      });
      showInfo();
    }
  }

  @autobind()
  showInfo() {
    const {
      realName,
      birthDate,
      gender,
      address,
      yearDate,
    } = this.state;
    const closePopup = popup((
      <div className="plr40 pb36">
        <p className="height138 flex-center borb1 rbold font50 fcolor1 fw1">Aadhaar Details</p>
        <Item title="Full Name" msg={<span className="ell1">{realName}</span>} />
        {birthDate ? <Item title="Date of Birth" msg={birthDate} /> : <Item title="Year of Birth" msg={yearDate} />}
        <Item title="Gender" msg={gender} />
        <Item title="Address" msg={address} />
        <Btn
          onClick={() => {
            closePopup();
            this.setState({
              skipFlag: 'N',
            });
            setTimeout(() => this.confirm(), 0);
          }}
          className="mt70">
          <span>{'Yes, it\'s me'}</span>
        </Btn>
        <Btn
          onClick={() => {
            closePopup();
            setTimeout(() => {
              this.aadhaar({ entrance: '错误提示弹窗' });
            }, 3000);
          }}
          className="mt30"
          color="bgcolor7-bg">
          <span className="fcolor1">Something wrong？ </span>
          <span className="fcolor8"> Re-scan</span>
        </Btn>
      </div>
    ), {});
  }

  @autobind()
  async confirm() {
    loadingOne();
    const { history, itemCommit } = this.props;
    const {
      reportId,
      aadhaarNo,
      gender,
      skipFlag,
      fFileId,
      bFileId,
      ocrData,
      address,
      birthDate,
      yearDate,
      realName,
    } = this.state;
    let rstImage = null;
    if (skipFlag === 'N') {
      rstImage = await upLoadImage([
        { fileKey: 'aadhaar_front_image', fileId: fFileId },
        { fileKey: 'aadhaar_rear_image', fileId: bFileId },
      ], 'AADHAAR');
      if (!rstImage) return;
    }
    const fileNameCodes = (rstImage && rstImage.fileNameCodes) || {};
    const rsaRst = await paramsNativeRsa({
      reportId,
      aadhaarNo,
      gender,
      address,
      userName: realName,
      birthDate: birthDate || yearDate,
      ocrData: JSON.stringify(ocrData),
    });
    const param = skipFlag === 'N' ? {
      skipFlag,
      frontMid: fileNameCodes.aadhaar_front_image,
      rearMid: fileNameCodes.aadhaar_rear_image,
      ...rsaRst,
    } : { skipFlag };
    const rst = await itemCommit(param, { msg: 0 });
    onEvent('0703');
    close();
    const {
      code, msg, data, flag,
    } = rst;
    if (flag !== 'S') {
      if (code === '2020') {
        close();
        oneError({
          msg: <p className="t-center">{msg}</p>,
          okText: 'Re-scan',
          ok: () => {
            this.aadhaar({ entrance: '信息确认弹窗' });
          },
        });
        return;
      }
      if (code !== '0') {
        infoOne(msg, true);
        return;
      }
    }
    setNodeInfo(data);
    if (data) history.push(USER_APPLY_NODE_MAP[data.nextNodeCode]);
  }

  render() {
    const { aadhaar } = this;
    return (
      <Page className="pl52 pr52 pt16 pages-apply-pan-container">
        <p className="rbold font56 lh66 fcolor1 fw1 nowrap">Aadhaar Authentication</p>
        <p className="mt30 fcolor3 flh42 font32 rreg">All uploded images will only be used for KYC process</p>
        <div onClick={aadhaar} className="pos-r page_img">
          <img src={require('./images/ada-2.png')} alt="" />
          <div className="width-100 height-100  pos-a l0 t0 t-center pt67">
            <p><img src={require('../images/pan-1.png')} className="page_img2 ilbl" alt="" /></p>
            <p className="mt38 flh33 fcolor5 font28">
              <span>Scan the</span>
              <span className="fcolor4"> front </span>
              <span>and</span>
              <span className="fcolor4"> back </span>
              <span>of your Aadhaar card</span>
            </p>
          </div>
        </div>
        <Safe />
      </Page>
    );
  }
}

function Right() {
  const state = getStoreState();
  const { nodeStepInfo = {} } = state.apply;
  if (nodeStepInfo.nextSkipFlag === 'Y' || nodeStepInfo.skipFlag === 'Y') return <span className="font32 lh32 fcolor8">Skip</span>;
  return '';
}

export default Main;
