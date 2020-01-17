/**
 * 设置
 * @author luxun
 */
import React from 'react';
import Page from 'src/components/page';
import { close, loadingOne, infoOne } from 'src/components/modal/toast';
import header from 'src/decorators/header';
import connect from 'src/decorators/connect';
import login from 'src/decorators/login';
import Com from 'src/pages/apply/face/face';
import { autobind } from 'core-decorators';
import { face } from 'src/pages/apply/utils';
import { post } from 'src/utils/fetch';
import { changePwd } from 'src/utils/native';
import {
  API_USER_PWD_CHECK,
  API_USER_PWD_FACE_SUBMIT,
} from 'src/constants/apis';

@connect([''], {})
@login()
@header()
class Main extends React.Component {
  state = {
    hasError: false,
    isHasPwsNo: null,
  };

   check = async () => {
     const rst = await post(API_USER_PWD_CHECK);
     if (rst) {
       const { pwdCheckFlag, pwdCheckMsg = '' } = rst;
       if (pwdCheckFlag !== 'Y') {
         infoOne(pwdCheckMsg);
         return null;
       }
     }
     return rst;
   }

  @autobind()
   async toFace() {
     loadingOne();
     const { props, check } = this;
     let { isHasPwsNo } = this.state;
     const { history } = props;
     if (!isHasPwsNo) {
       const checkRst = await check();
       if (!checkRst) return;
       const { thirdServiceInfo } = checkRst;
       const rst = await face(thirdServiceInfo);
       if (!rst) {
         close();
         this.setState({
           hasError: true,
         });
         return;
       }
       const { faceImage, faceData } = rst;
       const faceRst = await post(API_USER_PWD_FACE_SUBMIT, {
         transNo: checkRst.transNo,
         faceImage,
         faceData,
       });
       close();
       if (!faceRst) return;
       isHasPwsNo = faceRst.transNo;
       this.setState({
         isHasPwsNo,
       });
     }
     const pwdRst = await changePwd({
       transNo: isHasPwsNo,
     });
     const { code } = pwdRst;
     if (code === 'WLPS15005') {
       this.toFace();
       return;
     }
     if (pwdRst) {
       const { ERROR_TAG, msg } = pwdRst;
       if (ERROR_TAG) {
         infoOne(msg || '');
         return;
       }
       history.goBack();
     }
     close();
   }

  render() {
    const { hasError } = this.state;
    return (
      <Page className="pl52 pr52 pt16 pages-apply-pan-container">
        <Com face={this.toFace} hasError={hasError} />
      </Page>
    );
  }
}

export default Main;
