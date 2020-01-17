/**
 * 设置
 * @author xiaolong
*/
import React from 'react';
import Page from 'src/components/page';
import Item from 'src/components/item/item';
import connect from 'src/decorators/connect';
import header from 'src/decorators/header';
import login from 'src/decorators/login';
import classnames from 'classnames';

@connect(['user'], {})
@login()
@header()
class Main extends React.Component {
  componentDidMount() {
  }

  render() {
    const { user } = this.props;
    const { userPersonalInfo = {} } = user;
    const { myProFile = {} } = userPersonalInfo;
    const { aadhaarAuthentication, faceRecognition, panVerification } = myProFile;
    return (
      <Page className="pt14">
        <p className="plr46 rbold lh66 fw1 font56">My Profile</p>
        <div className="pt52 ml12">
          <Item
            className="pt42 pb42"
            icon={require('../images/item-4.png')}
            title="PAN Verification"
            msg={(
              <p className={classnames('flex-ali-center flex-jus-end font30 lh35', panVerification === 'Y' ? 'fcolor7' : 'fcolor3')}>
                <span>{panVerification === 'Y' ? 'finished' : 'unfinished'}</span>
                <img className="width30 height30 pl16" src={panVerification === 'Y' ? require('../images/item-2.png') : ''} alt="" />
              </p>
            )}
            onClick={() => {
              // if (panVerification !== 'Y') {
              //   const apply = async () => {
              //     await toApply({
              //       pwdCall: async () => {
              //         await apply();
              //       },
              //     });
              //   };
              //   await apply();
              // }
            }} />
          <Item
            className="pt42 pb42"
            icon={require('../images/item-3.png')}
            title={<p className="nowrap">Aadhaar Authentication</p>}
            msg={(
              <p className={classnames('flex-ali-center flex-jus-end font30 lh35', aadhaarAuthentication === 'Y' ? 'fcolor7' : 'fcolor3')}>
                <span>{aadhaarAuthentication === 'Y' ? 'finished' : 'unfinished'}</span>
                <img className="width30 height30 pl16" src={aadhaarAuthentication === 'Y' ? require('../images/item-2.png') : ''} alt="" />
              </p>
            )} />
          <Item
            className="pt42 pb42"
            icon={require('../images/item-1.png')}
            title="Face Recognition"
            msg={(
              <p className={classnames('flex-ali-center flex-jus-end font30 lh35', faceRecognition === 'Y' ? 'fcolor7' : 'fcolor3')}>
                <span>{faceRecognition === 'Y' ? 'finished' : 'unfinished'}</span>
                <img className="width30 height30 pl16" src={faceRecognition === 'Y' ? require('../images/item-2.png') : ''} alt="" />
              </p>
            )} />
        </div>
      </Page>
    );
  }
}

export default Main;
