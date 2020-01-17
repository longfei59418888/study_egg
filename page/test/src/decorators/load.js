/**
 * 组件延时器
 * promise   Promise Promise对象
 * Loading   Component 加载组件
 * 传入promise对象，当promise中执行resole时候组件加载完成
 * @author Xiaolong
 */
import React from 'react';

export default function loading(promise, Loading = '') {
  return function (Target) {
    return class Com extends React.Component {
      state={
        loadStatus: false,
        load: [],
      }
      componentWillMount() {
        this.setState({
          loadStatus: true,
        });
        if (promise) {
          promise(this.props, this.state).then((modules) => {
            const asyncComponent = [];
            if (modules) {
              modules.forEach((item) => {
                asyncComponent.push(item.default);
              });
            }
            this.setState({
              loadStatus: false,
              load: asyncComponent,
            });
          });
        }
      }
      render() {
        const { loadStatus, load } = this.state;
        if (loadStatus) {
          return !Loading ? '' : <Loading />;
        }
        return <Target {...this.props} load={load} />;
      }
    };
  };
}
