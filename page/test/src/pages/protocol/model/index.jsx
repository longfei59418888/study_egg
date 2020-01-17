/**
 * 360loan-india 协议模板
 * @author luxun
*/
import React from 'react';
import Page from 'src/components/page';
import { template } from 'lodash';
import header from 'src/decorators/header';
import { getProtocolParam, getProtocolContent } from '../utils';
import connect from '../../../decorators/connect';
import { getUserListDetail } from '../../../actions/loan';
import 'src/pages/protocol/model/index.scss';
import { loadingOne, close } from '../../../components/modal/toast';

@connect(['loan'], { getUserListDetail })
@header()
class Main extends React.Component {
    static _title='Loan Agreement'
    state={
      content: '',
      agreementParam: {},
    }
    async componentWillMount() {
      const { loan } = this.props;
      const { agreementNo } = loan;
      loadingOne();
      const { agreementParam, templateNo } = await getProtocolParam(
        agreementNo,
      );
      if (templateNo) {
        const content = await getProtocolContent(templateNo);
        this.setState({
          content,
          agreementParam,
        });
      }
      close();
    }

    render() {
      const { content = '', agreementParam = '' } = this.state;
      return (
        <Page>
          <div
            className="agreement-content"
            dangerouslySetInnerHTML={{ __html: template(content)(agreementParam) }} />
        </Page>
      );
    }
}

export default Main;
