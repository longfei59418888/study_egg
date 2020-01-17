/**
 * 设置
 * @author luxun
*/
import React from 'react';
import Page from 'src/components/page';
import Item from 'src/components/item/personItem';
import Btn from 'src/components/form/btn';
import { logout } from 'src/utils/native';
import { successOne } from 'src/components/modal/toast';
import { isLogin } from 'src/utils/common';
import header from 'src/decorators/header';
import connect from 'src/decorators/connect';
import { SETTING_INDEX_RESET_PSW } from 'src/constants/urls';

@connect([''], { })
@header()
class Main extends React.Component {
  componentDidMount() {
  }

  render() {
    const { history } = this.props;
    const login = isLogin();
    return (
      <Page className="pt14">
        <p className="plr50 rbold lh66 fw1 font56">Settings</p>
        <div className="pt52 ml10">
          <Item
            onClick={() => {
              history.push(SETTING_INDEX_RESET_PSW);
            }}
            icon={require('../../images/item-7.png')}
            title="Reset Password"
            hasArraw={require('../../images/item-arraw-1.png')}
            titleStyle={{ width: '5.6rem', color: '#1B1B4E' }}
            rightStyle={{ paddingRight: '.32rem' }} />
        </div>
        <div className="plr40 pt70">
          {
            login ? (
              <Btn
                onClick={() => {
                  logout();
                  successOne('exit successfully', 1500);
                  setTimeout(() => {
                    history.goBack();
                  }, 2000);
                }}
                color="bgcolor7-bg"
                className="fcolor7">
              Logout
              </Btn>
            ) : ''
          }
        </div>
      </Page>
    );
  }
}

export default Main;
