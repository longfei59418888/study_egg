/**
 * LEAGL
 * @author xiaolong
*/
import React from 'react';
import Page from 'src/components/page';
import Item from 'src/components/item/personItem';
import header from 'src/decorators/header';
import { SETTING_LEGAL_POLICIES_DETAIL } from 'src/constants/urls';
import LEGAL_LIST from '../list';

@header()
class Main extends React.Component {
  componentDidMount() {
  }

  render() {
    const { history } = this.props;
    return (
      <Page className="pt14">
        <p className="plr52 rbold lh66 fw1 font56">Legal & Policies</p>
        <div className="pt52">
          {LEGAL_LIST.map((item, index) => (
            <Item
              onClick={() => {
                history.push(`${SETTING_LEGAL_POLICIES_DETAIL}/${index}`);
              }}
              icon={item.icon}
              key={index}
              title={item.title}
              hasArraw={require('../../images/item-arraw-1.png')}
              titleStyle={{ width: '5.6rem', color: '#1B1B4E' }}
              rightStyle={{ paddingRight: '.32rem' }} />
          ))}
        </div>
      </Page>
    );
  }
}

export default Main;
