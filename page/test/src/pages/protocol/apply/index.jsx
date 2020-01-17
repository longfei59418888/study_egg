/**
 *  相关协议
 * @author xiaolong
*/
import React from 'react';
import Page from 'src/components/page';
import Btn from 'src/components/form/btn';
import { applyActivation } from 'src/pages/apply/utils';
import { autobind } from 'core-decorators';
import { loadingOne, close } from 'src/components/modal/toast';
import header from '../../../decorators/header';
import connect from '../../../decorators/connect';
import { onEvent } from '../../../utils/native';


@connect(['apply'], { })
@header()
class Main extends React.Component {
  componentDidMount() {
    onEvent('1401');
  }

  @autobind()
  async confirm() {
    loadingOne();
    const { history, apply = {} } = this.props;
    const rst = await applyActivation(apply.activationInfo || {});
    close();
    if (rst) history.goBack();
  }


  render() {
    return (
      <Page className="pt46 pages-apply-pan-container">
        <div className="plr52">
          <p className="rbold font50 lh66 fcolor1 fw1 nowrap"><span>Permissions & Consents</span></p>
          <p className="mt30 fcolor3 flh42 font32 rreg" />
        </div>
        <p className="mt16"><img style={{ height: '2.3rem' }} src={require('src/pages/apply/images/protocol1.png')} alt="" /></p>
        <div className="ofy plr40 flh46 fcolor1 font28 pb20 pos-a width-100" style={{ top: '4.4rem', bottom: '1.8rem' }}>
          <p>
              I hereby authorize 360Loan, to request and receive my credit score (“CIR”) from Equifax.
              I fully understand that the purpose of this CIR is to enable me to make informed lending decisions effectively and enable faster processing of credit applications to help provide speedier access of credit to me facilitated through the 360Loan.
              I further understand that 360Loan may apply for the CIR by themselves or through any of their partner tie-ups who are members of CIC, and I fully authorize 360Loan to share my details with such lending partner.
              By clicking on accept and agree, I also hereby consent to receiving communications including but not limited to SMS, e-mails, phone calls from 360Loan with respect to my transactions on the Application or for any other purpose.
              This consent will override any registration for DNC/NDNC requirement.
          </p>
        </div>
        <div className="sha2 pt40 plr40 pos-a b0 l0 width-100" style={{ height: '1.8rem' }}>
          <Btn onClick={this.confirm}>
            <span>Accept And Confirm</span>
          </Btn>
        </div>
      </Page>
    );
  }
}

export default Main;
