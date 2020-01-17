/**
 * 设置header
 * state __backPath 返回页面
 * @author Xiaolong
 */
import React from 'react';
import { HEADER_DEFAULT_TITLE, HEADER_DEFAULT_BACK_ICON, HEADER_DEFAULT_BACK_TEXT } from 'src/constants/index/default';
import Head from 'src/components/header';
import history from '../utils/init/history';

const header = {
  left: [],
  right: [],
  className: 'header-top',
  title: '',
  center: '',
};

export const TYPE_CENTER = 'jt-common-header-style-one';


export default function head(type) {
  let _classNameDefualt = '';
  if (type) _classNameDefualt = type;
  return function (Target) {
    return class Com extends React.Component {
      state = header
      componentWillMount() {
        const { componentWillMount } = Target.prototype;
        let _this = null;
        Target.prototype.componentWillMount = function () {
          _this = this;
          if (componentWillMount) componentWillMount.apply(this);
        };
        const { _onBack = null } = Target;
        const {
          _header = {},
          _title = HEADER_DEFAULT_TITLE,
          _center = null,
          _className = _classNameDefualt,
          _back = {
            text: HEADER_DEFAULT_BACK_TEXT,
            icon: HEADER_DEFAULT_BACK_ICON,
            onClick: () => {
              if (_onBack) {
                _this[_onBack]();
                return;
              }
              history.goBack();
            },
          },
          _left = [],
          _right = [],
          _noBack = false,
        } = Target;
        const right = _right.map(item => ({
          text: item.text,
          icon: item.icon,
          onClick: () => {
            if (_this[item.onClick]) _this[item.onClick]();
          },
        }));
        let left = _left.map(item => ({
          text: item.text,
          icon: item.icon,
          onClick: () => {
            if (_this[item.onClick]) _this[item.onClick]();
          },
        }));
        if (left.length < 1) left = [_back];
        if (_noBack) left = [];
        const data = {
          ..._header,
          ...{
            title: _title,
            center: _center,
            className: _className,
            left,
            right,
          }, 
        };
        this.setState(data);
      }
      render() {
        return (
          <div>
            <Head {...this.state} />
            <div className="jt-common-header-container pos-a width-100 b0 ofy">
              <Target {...this.props} />
            </div>
          </div>
        );
      }
    };
  };
}
