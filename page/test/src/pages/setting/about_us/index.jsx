/**
 * 360loan-india 关于我们
 * @author luxun
*/
import React from 'react';
import Page from 'src/components/page';
import header from 'src/decorators/header';

const navs = [
  { image: require('../../index/images/nav-1.png'), text: 'Easy to apply' },
  { image: require('../../index/images/nav-2.png'), text: 'Fast approval' },
  { image: require('../../index/images/nav-3.png'), text: 'High loan limit' },
  { image: require('../../index/images/nav-4.png'), text: 'Low interest rate' },
];
const features = [
  { image: require('../images/feature-1.png'), text: 'Fast approval', content: 'Applying online reduces the long and tedious credit approval process that plagues traditional banks' },
  { image: require('../images/feature-2.png'), text: 'Personal information is encrypted', content: '360 Finance uses state of the art technology to protect customer data and privacy' },
  { image: require('../images/feature-3.png'), text: 'No need for collateral', content: 'customers don\'t have to mortgage valuable assets for an emergeny loan' },
  { image: require('../images/feature-4.png'), text: 'Transparent fees', content: 'Our platform\'s transparent payment process does not have hidden fees' },
];
const professional = [
  {
    image: require('../images/number-1.png'), title: 'Identity confirmation', text: 'Need Pan card / Aadhaar card', arrowImg: require('../images/arrow-tip.png'), 
  },
  {
    image: require('../images/number-2.png'), title: 'Authoritative evaluation', text: 'Big data evaluation', arrowImg: require('../images/arrow-tip.png'),
  },
  { image: require('../images/number-3.png'), title: 'Gain a credit limit', text: 'Obtain current credit limit as cash' },
];
@header()
class Main extends React.Component {
    static _title='about us'
    render() {
      return (
        <Page>
          <img className="pos-a ilbl width-100 height338 clear:after" src={require('../images/top-bg.png')} alt="" style={{ zIndex: -1 }} />
          <div className="t-center pl36 pr36">
            <img className="ilbl mt62 mb18 width318 height74" src={require('../images/360-loan.png')} alt="" />
            <span className="bl font26 fcolor6">Instant Online Credit for Everyone</span>
            <div className="mt50 mb78 height550 rad6 bgcolor6 pt48 pl42 pr42 pb42 t-left sha2 pos-r">
              <img className="bl width180 height24" src={require('../images/360-loan2.png')} alt="" />
              <p className="pos-a l42 width598 font26 lh38 flh38 mt24 t-justify height532 zindex5">
                  360 Loan is a finance platform that aims to provide instant personal loans to an
                  underserved Indian public. 360 Loan is a subsidiary of 360 Finance, a NASDAQ listed company
                  and a partner of 360 Group, globally one of the largest internet company that connects over
                  one billion mobile devices. Since its founding, 360 Finance has provided top-notch financial
                  service to 6.4 million customers worldwide. We take great pride in our extensive experience
                  in big data, artificial intelligence, cloud computing, and risk management.
              </p>
              <img className="height194 width-100 ilbl pos-a b0 l0 zindex3" src={require('../images/content-bg.png')} alt="" />
            </div>
            <Tip tip="Core advantages" content="360loan Selective Money Service" />
            <Nav />
          </div>
          <div className="t-center pl36 pr36 bglinear3 pt78">
            <Tip tip="Product features" content="360 Loan select payment for goods service" />
            <Feature />
          </div>
          <div className="t-center pl36 pr36 bglinear3 pt98">
            <Tip tip="Professional and fast" content="apply online super fast money tranfer" />
            <Professional />
          </div>
        </Page>
      );
    }
}

function Nav() {
  return (
    <div className="clear mt36 mb12 jt-personal-about-nav">
      {navs.map((item, index) => {
        const { image, text } = item;
        return (
          <div key={index} className="left pl20" style={{ width: '50%' }}>
            <div className="flex flex-ali-center height140">
              <img className="width52 height52 mr24" src={image} alt="" />
              <p>{text}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Tip(prop) {
  const { tip, content } = prop;
  return (
    <>
      <p className="fcolor17 font36 mb14">{tip}</p>
      <p>
        <img className="ilbl height6 width36 v-middle" src={require('../images/nav-bar.png')} alt="" />
        <span className="fcolor2 font24 ml22 mr22">{content}</span>
        <img className="ilbl height6 width36 v-middle" src={require('../images/nav-bar.png')} alt="" />
      </p>
    </>
  );
}

function Feature() {
  return (
    <div className="mt82">
      {features.map((item, index) => {
        const { image, text, content } = item;
        return (
          <div key={index} className="height144 t-left mb84">
            <img className="ilbl width112 height112 left mr30" src={image} alt="" />
            <div>
              <span className="fcolor18 font32 mb16 bl">{text}</span>
              <span className="fcolor2 font26 bl">{content}</span>
            </div>
          </div>
        ); 
      })}
    </div>
  );
}

function Professional() {
  return (
    <div className="mt56">
      {professional.map((item, index) => {
        const {
          image, title, text, arrowImg = '', 
        } = item;
        return (
          <div key={index} className="height176 bgcolor19 t-center pos-r mb72 pt22">
            <img className="ilbl width48 height48 mb14" src={image} alt="" />
            <p className="fcolor18 font32">{title}</p>
            <p className="fcolor2 font24">{text}</p>
            { arrowImg ? <img className="ilbl width18 height66 pos-a t172" style={{ marginLeft: -4 }} src={arrowImg} alt="" /> : ''}
          </div>
        );
      })}
    </div>
  );
}

export default Main;
