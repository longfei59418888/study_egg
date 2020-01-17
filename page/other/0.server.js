exports.ids = [0];
exports.modules = {

/***/ 21:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _regenerator = __webpack_require__(11);

var _regenerator2 = _interopRequireDefault(_regenerator);

var _jsx = function () { var REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol.for && Symbol.for("react.element") || 0xeac7; return function createRawReactElement(type, props, key, children) { var defaultProps = type && type.defaultProps; var childrenLength = arguments.length - 3; if (!props && childrenLength !== 0) { props = {}; } if (props && defaultProps) { for (var propName in defaultProps) { if (props[propName] === void 0) { props[propName] = defaultProps[propName]; } } } else if (!props) { props = defaultProps || {}; } if (childrenLength === 1) { props.children = children; } else if (childrenLength > 1) { var childArray = Array(childrenLength); for (var i = 0; i < childrenLength; i++) { childArray[i] = arguments[i + 3]; } props.children = childArray; } return { $$typeof: REACT_ELEMENT_TYPE, type: type, key: key === undefined ? null : '' + key, ref: null, props: props, _owner: null }; }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _class;

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = __webpack_require__(33);

__webpack_require__(295);

var _decorators = __webpack_require__(51);

var _mobxReact = __webpack_require__(52);

var _article = __webpack_require__(104);

var _article2 = _interopRequireDefault(_article);

var _extend = __webpack_require__(105);

var _index = __webpack_require__(106);

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var _ref2 = _jsx('span', {}, void 0, ' \u5206\u7C7B : ');

var _ref3 = _jsx('hr', {});

var _ref5 = _jsx('span', {}, void 0, ' \u5206\u7C7B : ');

var _ref6 = _jsx('hr', {});

var Main = (_dec = (0, _decorators.loading)(function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee(props, state) {
        var id, date, key;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        id = props.match.params.id ? props.match.params.id : null;
                        date = props.match.params.date ? props.match.params.date : null;
                        key = props.match.params.key ? props.match.params.key : null;
                        _context.next = 5;
                        return _article2.default.init(id, date, key);

                    case 5:
                        if (!(_article2.default.list == null)) {
                            _context.next = 8;
                            break;
                        }

                        _context.next = 8;
                        return _article2.default.getList();

                    case 8:
                        return _context.abrupt('return', []);

                    case 9:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    }));

    return function (_x, _x2) {
        return _ref.apply(this, arguments);
    };
}()), _dec(_class = (0, _mobxReact.observer)(_class = function (_React$Component) {
    _inherits(Main, _React$Component);

    function Main() {
        _classCallCheck(this, Main);

        return _possibleConstructorReturn(this, (Main.__proto__ || Object.getPrototypeOf(Main)).apply(this, arguments));
    }

    _createClass(Main, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            if (!(0, _extend.DEVICE_IS_IPHONE)()) {
                var getTop = function getTop() {
                    _this.scrollTop = boxList.scrollTop;
                    if (_article2.default.loading || _article2.default.end) return;
                    if (scroll.offsetHeight - (document.body.offsetHeight - 50 + boxList.scrollTop) < 500) {
                        _article2.default.getList();
                    }
                };

                var boxList = this.refs['boxList'],
                    _this = this,
                    scroll = this.refs['scroll'];
                _this.scrollTop = _article2.default.position;
                boxList.scrollTop = _this.scrollTop;
                boxList.addEventListener('scroll', getTop);


                this.removeEvent = function () {
                    boxList.removeEventListener('scroll', getTop);
                };
            }
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            if (!(0, _extend.DEVICE_IS_IPHONE)()) {
                _article2.default.position = this.scrollTop;
                this.removeEvent();
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _this3 = this;

            if (!(0, _extend.DEVICE_IS_IPHONE)()) {
                return _react2.default.createElement(
                    'div',
                    { ref: 'boxList', className: 'home' },
                    _react2.default.createElement(
                        'div',
                        { ref: 'scroll', className: 'scroll' },
                        _jsx('div', {}, void 0, _article2.default.list.map(function (item, index) {
                            return _jsx('div', {
                                className: 'item'
                            }, void 0, _jsx('p', {
                                className: 'h5'
                            }, void 0, item.title), _jsx('p', {
                                className: 'info'
                            }, void 0, _jsx('span', {}, void 0, '\u53D1\u8868\u4E8E : ', (0, _extend.getUTFDate)(item.publicDate).split(' ')[0]), ' |', _ref2, _jsx(_reactRouterDom.Link, {
                                to: '/cate/' + item.classify.id
                            }, void 0, _jsx('span', {}, void 0, item.classify.title))), _jsx('div', {
                                className: 'descript'
                            }, void 0, _jsx('div', {
                                dangerouslySetInnerHTML: { __html: item.description }
                            })), _jsx('div', {
                                className: 'btn'
                            }, void 0, _jsx(_reactRouterDom.Link, {
                                to: '/article/' + item.id
                            }, void 0, '\u9605\u8BFB\u5168\u6587')), _ref3);
                        })),
                        _jsx('div', {
                            className: 'loading'
                        }, void 0, _article2.default.end ? _article2.default.list.length < 1 ? '--努力更新中--' : '--完毕--' : '加载更多..')
                    )
                );
            }
            return _react2.default.createElement(
                _index2.default,
                {
                    ref: 'scroller',
                    init: { x: 0, y: _article2.default.position },
                    leaveBefor: function leaveBefor(scroller) {
                        _article2.default.position = scroller.y;
                    },
                    onLoadMore: function () {
                        var _ref4 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee2(scroller, bak) {
                            return _regenerator2.default.wrap(function _callee2$(_context2) {
                                while (1) {
                                    switch (_context2.prev = _context2.next) {
                                        case 0:
                                            _context2.next = 2;
                                            return _article2.default.getList();

                                        case 2:
                                            if (_article2.default.end) bak(true);else bak();

                                        case 3:
                                        case 'end':
                                            return _context2.stop();
                                    }
                                }
                            }, _callee2, _this3);
                        }));

                        return function (_x3, _x4) {
                            return _ref4.apply(this, arguments);
                        };
                    }()
                },
                _jsx('div', {
                    className: 'home'
                }, void 0, _jsx('div', {
                    className: 'scroll'
                }, void 0, _jsx('div', {}, void 0, _article2.default.list.map(function (item, index) {
                    return _jsx('div', {
                        className: 'item'
                    }, void 0, _jsx('p', {
                        className: 'h5'
                    }, void 0, item.title), _jsx('p', {
                        className: 'info'
                    }, void 0, _jsx('span', {}, void 0, '\u53D1\u8868\u4E8E : ', (0, _extend.getUTFDate)(item.publicDate).split(' ')[0]), ' |', _ref5, _jsx(_reactRouterDom.Link, {
                        to: '/cate/' + item.classify.id
                    }, void 0, _jsx('span', {}, void 0, item.classify.title))), _jsx('div', {
                        className: 'descript'
                    }, void 0, _jsx('div', {
                        dangerouslySetInnerHTML: { __html: item.description }
                    })), _jsx('div', {
                        className: 'btn'
                    }, void 0, _jsx(_reactRouterDom.Link, {
                        to: '/article/' + item.id
                    }, void 0, '\u9605\u8BFB\u5168\u6587')), _ref6);
                }))))
            );
        }
    }]);

    return Main;
}(_react2.default.Component)) || _class) || _class);
exports.default = Main;


;(function register() {
    /* react-hot-loader/webpack */if (false) {
        if (typeof __REACT_HOT_LOADER__ === 'undefined') {
            return;
        } /* eslint-disable camelcase, no-undef */var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */if (typeof webpackExports === 'function') {
            __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/wangxiaolong/Desktop/work/my-items/client/src/containers/home/index.jsx");return;
        } /* eslint-disable no-restricted-syntax */for (var key in webpackExports) {
            /* eslint-enable no-restricted-syntax */if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) {
                continue;
            }var namedExport = void 0;try {
                namedExport = webpackExports[key];
            } catch (err) {
                continue;
            }__REACT_HOT_LOADER__.register(namedExport, key, "/Users/wangxiaolong/Desktop/work/my-items/client/src/containers/home/index.jsx");
        }
    }
})();

/***/ }),

/***/ 295:
/***/ (function(module, exports, __webpack_require__) {


    var content = __webpack_require__(296);
    var insertCss = __webpack_require__(13);

    if (typeof content === 'string') {
      content = [[module.i, content, '']];
    }

    module.exports = content.locals || {};
    module.exports._getContent = function() { return content; };
    module.exports._getCss = function() { return content.toString(); };
    module.exports._insertCss = function(options) { return insertCss(content, options) };
    
    // Hot Module Replacement
    // https://webpack.github.io/docs/hot-module-replacement
    // Only activated in browser context
    if (false) {
      var removeCss = function() {};
      module.hot.accept("!!../../../node_modules/css-loader/index.js??ref--4-1!../../../node_modules/sass-loader/lib/loader.js!./index.scss", function() {
        content = require("!!../../../node_modules/css-loader/index.js??ref--4-1!../../../node_modules/sass-loader/lib/loader.js!./index.scss");

        if (typeof content === 'string') {
          content = [[module.id, content, '']];
        }

        removeCss = insertCss(content, { replace: true });
      });
      module.hot.dispose(function() { removeCss(); });
    }
  

/***/ }),

/***/ 296:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(12)(undefined);
// imports


// module
exports.push([module.i, ".home {\n  position: relative;\n  height: 100%;\n  overflow: auto; }\n  .home .scroll {\n    padding: 70px 40px 0; }\n    .home .scroll .item {\n      color: #ddd;\n      margin-bottom: 90px; }\n      .home .scroll .item .h5 {\n        text-align: center;\n        font-size: 26px;\n        letter-spacing: 1px; }\n      .home .scroll .item .info {\n        font-size: 12px;\n        color: #aaa;\n        letter-spacing: 1px;\n        text-align: center;\n        line-height: 40px; }\n        .home .scroll .item .info a {\n          color: #aaa; }\n      .home .scroll .item .descript {\n        line-height: 2;\n        margin: 30px 0; }\n      .home .scroll .item .btn {\n        padding: 30px 0 50px;\n        text-align: center; }\n        .home .scroll .item .btn a {\n          color: #666;\n          padding: 7px 14px;\n          background: #fff;\n          border-radius: 2px; }\n          .home .scroll .item .btn a:hover {\n            opacity: .9; }\n      .home .scroll .item hr {\n        width: 50px;\n        opacity: .2;\n        margin: 30px auto; }\n    .home .scroll .loading {\n      line-height: 60px;\n      color: #aaa;\n      font-size: 12px;\n      letter-spacing: 2px;\n      text-align: center; }\n\n@media screen and (max-width: 640px) {\n  .home .scroll .item .h5 {\n    font-size: 18px;\n    height: 18px;\n    word-break: break-all;\n    text-overflow: ellipsis;\n    overflow: hidden; }\n  .home .scroll .item .descript img {\n    max-width: 100% !important;\n    height: auto !important; }\n  .home .scroll .item .descript pre {\n    white-space: pre !important;\n    width: 100%;\n    overflow: scroll; } }\n", ""]);

// exports


/***/ })

};;