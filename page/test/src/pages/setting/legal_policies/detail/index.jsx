/**
 * help
 * @author xiaolong
*/
import React from 'react';
import Page from 'src/components/page';
import header from 'src/decorators/header';
import { getProtocolContent } from 'src/pages/protocol/utils';
import { template } from 'lodash';
import LEGAL_LIST from '../list';
import { close, loadingOne } from '../../../../components/modal/toast';

@header()
class Main extends React.Component {
    state={
      contentText: '',
    }
    async componentWillMount() {
      loadingOne();
      const contentText = await getProtocolContent('ATA588046692278862601');
      close();
      if (contentText) {
        this.setState({
          contentText,
        });
      }
    }

    render() {
      const { match } = this.props;
      const { params = {} } = match;
      const content = LEGAL_LIST[params.id] || {};
      const { contentText } = this.state;

      return (
        <Page className="pt14 plr52">
          <p className=" rbold lh66 fw1 font56">{content.title}</p>
          <p className="pt50 flh32 font34">
            <img src={content.iconDetail} alt="" />
          </p>
          <div className=" flh54 font28 pt10">
            {!contentText ? '' : <div dangerouslySetInnerHTML={{ __html: template(contentText)({}) }} />}
          </div>
        </Page>
      );
    }
}

export default Main;
