import React from 'react';
import Page from 'src/components/page';
import Btn from 'src/components/form/btn';
import classnames from 'classnames';
import history, { toIndex } from 'src/utils/init/history';
import header from '../../../decorators/header';
import { onEvent } from '../../../utils/native';


const TYPE_LIST = {
  1: {
    title: 'Congratulations!',
    msg: 'The payment platform and banks are currently processing your payment. Please check your payment results later. You will be eligible for getting a higher credit line with on-time repayment.',
    image: require('../images/result-1.png'),
    ptitle: 'higher credit line',
    color: 'fcolor14',
    btn: 'Get It Now',
  },
  2: {
    title: 'Payment failed',
    msg: 'On-time repayment will help you build a good credit score. You will be eligible for getting a higher credit line with on-time repayment.',
    image: require('../images/result-2.png'),
    ptitle: 'Please try again.',
    color: 'fcolor10',
    btn: 'Try Again Later',
  },
};

@header()
class Main extends React.Component {
  componentWillMount() {
    toIndex();
  }
  componentDidMount() {
    onEvent('2101');
  }
  componentWillUnmount() {
    onEvent('2103');
  }

  render() {
    const { match } = this.props;
    const { type = 1 } = match.params || {};
    const typeInfo = TYPE_LIST[type] || {};
    return (
      <Page className="plr40 pt46">
        <p className="rbold font56 lh66 fcolor1 fw1">{typeInfo.title}</p>
        <p className="mt30 fcolor3 flh42 font32 rreg">{typeInfo.msg}</p>
        <div style={{ marginTop: '1.68rem' }} className={classnames('t-center flh46 font34 osansbl fw1', typeInfo.color)}>
          <img style={{ height: '1.7rem', width: '1.7rem' }} className="ilbl" src={typeInfo.image} alt="" />
          <p className="mt21">{typeInfo.ptitle}</p>
        </div>
        <Btn
          onClick={() => {
            if (type === 2) {
              onEvent('2102');
            }
            history.toIndex();
          }}
          style={{ marginTop: '1.06rem' }}>
          {typeInfo.btn}
        </Btn>
      </Page>
    );
  }
}
export default Main;
