/**
 * pan
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
import { APPLY_PAN_RESULT, USER_APPLY_NODE_MAP } from 'src/constants/urls';
import { loadingOne, infoOne, close } from 'src/components/modal/toast';
import { oneError } from 'src/components/modal/confirm';
import connect from 'src/decorators/connect';
import { itemCommit, getPanResult } from 'src/actions/apply';
import { warnLog } from 'src/utils/extend';
import {
  onBackOne, panOcr, setNodeInfo, upLoadImage, paramsNativeRsa,
} from '../utils';
import { onEvent } from '../../../utils/native';

@connect(['apply'], { itemCommit })
@header()
class Main extends React.Component {
  state={
    userFatherName: '',
    userName: '',
    birthDate: '',
    yearDate: '',
    panCode: '',
    reportId: '',
    ocrData: '',
    fileId: '',
  }

  componentDidMount() {
    onBackOne({ eventId: '0505', resourcePage: 'PAN' });
    onEvent('0501');
  }
  @autobind()
  async getPanOcr(param) {
    loadingOne();
    const {
      props, showInfo,
    } = this;
    const { entrance = '' } = param;
    const { nodeStepInfo = {} } = props.apply;
    const firstTime = new Date().getTime();
    const rst = await panOcr(nodeStepInfo.thirdServiceInfo);
    setTimeout(() => close(), 0);
    const secondesTime = new Date().getTime();
    try {
      onEvent('0502', {
        Camera: '允许',
        operationTime: ((secondesTime - firstTime) / 1000).toFixed(0),
        result: '成功',
        failReason: !rst.ERROR_TAG ? '' : rst.msg,
        entrance: entrance || 'PAN页面',
      });
    } catch (e) {
      warnLog(e);
    }
    if (rst && rst.ERROR_TAG) {
      if (rst.flag === 'C') return;
      if (rst.data && rst.data.scanResult) {
        const { comment } = JSON.parse(rst.data.scanResult);
        infoOne(comment);
      } else {
        infoOne(rst.msg || '');
      }
    } else {
      const scanResult = JSON.parse(rst.scanResult);
      const imageMap = JSON.parse(rst.imageMap);
      const { data } = scanResult;
      this.setState({
        userFatherName: data.user_father_name,
        userName: data.user_name,
        birthDate: data.date_of_birth || '',
        yearDate: data.year_of_birth || '',
        panCode: data.pan_code,
        reportId: scanResult.report_id,
        fileId: imageMap.filePanId,
        ocrData: data,
      });
      showInfo();
    }
  }

  @autobind()
  showInfo() {
    const {
      userFatherName, userName, birthDate, panCode, yearDate,
    } = this.state;
    const closePopup = popup((
      <div className="plr40 pb36">
        <p className="height138 flex-center borb2 rbold font50 fcolor1 fw1">PAN Details</p>
        <Item title="Full Name" msg={<span className="ell1">{userName}</span>} />
        {birthDate ? <Item title="Date of Birth" msg={birthDate} /> : <Item title="Year of Birth" msg={yearDate} />}
        <Item title="PAN Number" msg={panCode} />
        <Item title="Father’s Name" msg={userFatherName} />
        <Btn
          onClick={() => {
            closePopup();
            this.confirm();
          }}
          className="mt70">
          <span>Yes , it’s me</span>
        </Btn>
        <Btn
          onClick={() => {
            closePopup();
            this.getPanOcr({ entrance: '信息确认弹窗' });
          }}
          className="mt30"
          color="bgcolor7-bg">
          <span className="fcolor1">Something wrong？ </span>
          <span className="fcolor8">
            Re-scan
          </span>
        </Btn>
      </div>
    ), {});
  }
  @autobind()
  async confirm() {
    const { history, itemCommit } = this.props;
    loadingOne();
    const {
      userFatherName, userName, birthDate, panCode, reportId, ocrData, fileId, yearDate,
    } = this.state;
    const rstImage = await upLoadImage([
      { fileKey: 'pan_image', fileId },
    ], 'PANOCR');
    if (!rstImage) return;
    const { fileNameCodes = {} } = rstImage;
    const rsaRst = await paramsNativeRsa({
      reportId,
      userName,
      birthDate: birthDate || yearDate,
      fatherName: userFatherName,
      panNo: panCode,
      ocrData: JSON.stringify(ocrData),
    });
    const rst = await itemCommit({
      frontMid: fileNameCodes.pan_image,
      ...rsaRst,
    }, {
      msg: 0,
    });
    onEvent('0504');
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
            this.getPanOcr({ entrance: '错误提示弹窗' });
          },
        });
        return;
      }
      infoOne(msg, true);
      return;
    }

    const panResult = await getPanResult(reportId);
    if (!panResult) return;
    const { verifiedResult, surplusTime, pollingTime } = panResult;
    if (verifiedResult === 'S' || surplusTime < 1) {
      setNodeInfo(panResult);
      history.push(USER_APPLY_NODE_MAP[data.nextNodeCode]);
      return;
    }
    setNodeInfo({
      panInfo: {
        panFlag: verifiedResult,
        surplusTime,
        pollingTime,
        reportId,
      }, 
    });
    close();
    if (data) history.push(APPLY_PAN_RESULT);
  }

  render() {
    return (
      <Page className="pl52 pr52 pt16 pages-apply-pan-container">
        <p className="rbold font56 lh66 fcolor1 fw1">PAN Verification</p>
        <p className="mt30 fcolor3 flh42 font32 rreg">All uploded images will only use KYC process</p>
        <div onClick={this.getPanOcr} className="pos-r page_img">
          <img src={require('./images/pan-2.png')} alt="" />
          <div className="width-100 height-100  pos-a l0 t0 t-center pt67">
            <p><img src={require('../images/pan-1.png')} className="page_img2 ilbl" alt="" /></p>
            <p className="mt38 flh33 fcolor5 font28">
              <span>Scan the</span>
              <span className="fcolor4"> front </span>
              <span>of your PAN card</span>
            </p>
          </div>
        </div>
        <Safe />
      </Page>
    );
  }
}

export default Main;
