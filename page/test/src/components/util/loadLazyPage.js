/**
 * 页面加载器
 * @author Xiaolong
 */
import React, { Suspense, Component } from 'react';
import classnames from 'classnames';
import { getTop } from 'src/utils/init';


class Com extends Component {
  constructor() {
    super();
    this.top = getTop();
  }
  render() {
    const {
      children, className, style = {}, top = false,
    } = this.props;
    return (
      <div
        style={{
          ...{
            top: top ? 0 : this.top,
          },
          ...style,
        }}
        className={classnames('jt-common-page-container', className)}>
        <Suspense fallback={null}>
          {children}
        </Suspense>
      </div>
    );
  }
}


export default Com;
