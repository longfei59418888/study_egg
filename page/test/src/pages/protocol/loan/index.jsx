/**
 *  相关协议
 * @author luxun
*/
import React from 'react';

export default class Main extends React.Component {
  render() {
    const { history } = this.props;
    return (
      <div>
        <p>LoanProtocol</p>
        <hr />
        <p
          onClick={() => {
            history.goBack();
          }}>
                back
        </p>
      </div>
    );
  }
}
