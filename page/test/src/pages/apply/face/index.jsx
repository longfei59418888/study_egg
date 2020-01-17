/**
 * face
 * @author Xiaolong
 */
import React from 'react';
import '../index.scss';
import header from 'src/decorators/header';
import Page from 'src/components/page';
import connect from 'src/decorators/connect';
import { autobind } from 'core-decorators';
import { itemCommit } from 'src/actions/apply';
import {
  onBackOne, face, settingTradPwd, setNodeInfo,
} from '../utils';
import { close, loadingOne } from '../../../components/modal/toast';
import Com from './face';
import { onEvent } from '../../../utils/native';


@connect(['apply'], {
  itemCommit,
})
@header()
class Main extends React.Component {
  state={
    hasError: false,
  }
  componentDidMount() {
    const { hasError } = this.state;
    onBackOne({ eventId: '0803', resourcePage: hasError ? '人脸失败' : '首次人脸' });
    onEvent('0801');
  }

  @autobind()
  async toFace(param) {
    loadingOne();
    const { props } = this;
    const { itemCommit, apply } = props;
    const { nodeStepInfo = {} } = apply;
    const { thirdServiceInfo = {} } = nodeStepInfo;
    const { paramThirdInfo = '' } = param;
    const thirdServiceInfos = paramThirdInfo || thirdServiceInfo;
    const rst = await face(thirdServiceInfos, { eventId: '0802', type: '人脸页面' });
    if (!rst) {
      setTimeout(() => {
        close();
      });
      this.setState({
        hasError: true,
      });
      return;
    }
    const commitRst = await itemCommit(rst);
    close();
    if (!commitRst) return;
    setNodeInfo(commitRst);
    await settingTradPwd({
      ...commitRst,
      ...{
        nodeNo: commitRst.nextNodeNo,
        nodeCode: commitRst.nextNodeCode,
      },
    }, { passwordKey: 'password' }, (param) => {
      const { toFace } = this;
      toFace(param);
    });
  }
  render() {
    const { toFace } = this;
    const { hasError } = this.state;
    return (
      <Page className="pl52 pr52 pt16 pages-apply-pan-container">
        <Com face={toFace} hasError={hasError} />
      </Page>
    );
  }
}

export default Main;
