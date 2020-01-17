/**
 * help
 * @author xiaolong
*/
import React from 'react';
import Page from 'src/components/page';
import header from 'src/decorators/header';
import HELP_LIST from '../list';

@header()
class Main extends React.Component {
  componentDidMount() {
  }

  render() {
    const { match } = this.props;
    const { params = {} } = match;
    const content = HELP_LIST[params.id] || {};

    return (
      <Page className="pt14 plr52">
        <p className=" rbold lh66 fw1 font56">FAQ</p>
        <p className="pt60  pb34 borb1 flh32 font34">{content.title}</p>
        <div className="fcolor3 flh54 font28 pt28">
          {content.text}
        </div>
      </Page>
    );
  }
}

export default Main;
