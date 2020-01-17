"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _iscrollProbe = _interopRequireDefault(require("./iscroll-probe.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// 该文件被修改
var AppComponent =
  /*#__PURE__*/
  function (_React$Component) {
    _inherits(AppComponent, _React$Component);

    function AppComponent(props, context) {
      var _this2;

      _classCallCheck(this, AppComponent);

      _this2 = _possibleConstructorReturn(this, _getPrototypeOf(AppComponent).call(this, props, context));

      _defineProperty(_assertThisInitialized(_this2), "refreshEnd", function (type) {
        // type true:加载完毕
        var _assertThisInitialize = _assertThisInitialized(_this2),
          refreshState = _assertThisInitialize.refreshState,
          iScrollInstance = _assertThisInitialize.iScrollInstance,
          loadMoreState = _assertThisInitialize.loadMoreState;

        _this2.setState({
          refreshCom: refreshState.end
        });

        iScrollInstance.refreshEnd();
        _this2.canRefresh = false;
        setTimeout(function () {
          _this2.setState({
            loadMoreCom: loadMoreState.loading,
            refreshCom: refreshState.init
          });

          _this2.loadEnd = false;
          if (type) _this2.setEnd();
          iScrollInstance.refresh();
          _this2.isRefreshIng = false;
        }, 50);
      });

      var refreshStateDefault = {
        init: _react.default.createElement("p", null, "\u4E0B\u62C9\u5237\u65B0..."),
        canLoading: _react.default.createElement("p", null, "\u677E\u624B\u5237\u65B0..."),
        loading: _react.default.createElement("p", null, "\u6B63\u5728\u5237\u65B0..."),
        end: _react.default.createElement("p", null, "\u5237\u65B0\u5B8C\u6210...")
      };
      var loadMoreStateDefault = {
        init: _react.default.createElement("p", null, "\u52A0\u8F7D\u66F4\u591A..."),
        loading: _react.default.createElement("p", null, "\u6B63\u5728\u52A0\u8F7D..."),
        end: _react.default.createElement("p", null, "\u52A0\u8F7D\u5B8C\u6BD5..")
      };

      var _this2$props = _this2.props,
        _this2$props$onRefres = _this2$props.onRefresh,
        onRefresh = _this2$props$onRefres === void 0 ? false : _this2$props$onRefres,
        _this2$props$onLoadMo = _this2$props.onLoadMore,
        onLoadMore = _this2$props$onLoadMo === void 0 ? false : _this2$props$onLoadMo,
        _this2$props$refreshH = _this2$props.refreshHeight,
        refreshHeight = _this2$props$refreshH === void 0 ? 60 : _this2$props$refreshH,
        _this2$props$refreshS = _this2$props.refreshState,
        _refreshState = _this2$props$refreshS === void 0 ? {} : _this2$props$refreshS,
        _this2$props$loadMore = _this2$props.loadMoreState,
        _loadMoreState = _this2$props$loadMore === void 0 ? {} : _this2$props$loadMore;

      refreshStateDefault = {...refreshStateDefault, ..._refreshState};
      loadMoreStateDefault = {...loadMoreStateDefault, ..._loadMoreState};
      _this2.state = {
        refreshCom: refreshStateDefault.init,
        loadMoreCom: loadMoreStateDefault.init
      };
      _this2.onRefresh = onRefresh;
      _this2.refreshHeight = refreshHeight;
      _this2.refreshState = refreshStateDefault;
      _this2.loadMoreState = loadMoreStateDefault;
      _this2.onLoadMore = onLoadMore;
      _this2.canRefresh = false; // 是否可以再次刷新

      _this2.isRefreshIng = false; // 是否在刷新中

      _this2.canLoadMore = false; // 是否可以再次加载

      _this2.loadMoreIng = false; // 是否在加载中

      _this2.loadEnd = false; // 是否加载完毕

      _this2.doRefresh = false; //

      _this2.style = {
        container: {
          height: '100%',
          width: '100%',
          overflow: 'hidden',
          position: 'absolute'
        },
        boxScroll: {
          position: 'absolute',
          top: _this2.onRefresh ? -refreshHeight : 0,
          width: '100%',
          overflow: 'hidden',
          bottom: 0
        },
        refresh: {
          height: refreshHeight,
          display: _this2.onRefresh ? 'flex' : 'none',
          alignItems: 'center',
          justifyContent: 'center'
        },
        loadMore: {
          height: refreshHeight,
          display: _this2.onLoadMore ? 'flex' : 'none',
          alignItems: 'center',
          justifyContent: 'center'
        }
      };
      return _this2;
    }

    _createClass(AppComponent, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        var _this3 = this;

        var _this = this;

        var box = this.box,
          boxScroll = this.boxScroll,
          onRefresh = this.onRefresh,
          refreshHeight = this.refreshHeight;
        var _this$props = this.props,
          init = _this$props.init,
          _this$props$onScroll = _this$props.onScroll,
          onScroll = _this$props$onScroll === void 0 ? null : _this$props$onScroll; // 设置最小高度，保证页面永远可以滚动

        box.style['min-height'] = "".concat(boxScroll.offsetHeight + 1, "px");
        this.iScrollInstance = new _iscrollProbe.default(boxScroll, {
          probeType: 3,
          mouseWheel: true,
          disablePointer: true,
          disableTouch: false,
          disableMouse: false,
          hasRefresh: onRefresh,
          refreshHeight: refreshHeight,
          preventDefault: false
        });
        var iScrollInstance = this.iScrollInstance; // 滚动中

        iScrollInstance.on('scroll', function () {
          var isRefreshIng = _this3.isRefreshIng,
            loadMoreIng = _this3.loadMoreIng,
            onRefresh = _this3.onRefresh,
            canRefresh = _this3.canRefresh,
            refreshState = _this3.refreshState,
            onLoadMore = _this3.onLoadMore,
            loadEnd = _this3.loadEnd,
            canLoadMore = _this3.canLoadMore; // 正在加载或刷新直接返回

          if (onScroll) onScroll(iScrollInstance);
          if (isRefreshIng || loadMoreIng) return; // 刷新

          if (onRefresh) {
            if (iScrollInstance.y > refreshHeight && !canRefresh) {
              if (!canRefresh) {
                _this3.setState({
                  refreshCom: refreshState.canLoading
                });
              }

              _this3.canRefresh = true; // 可以刷新
            }

            if (iScrollInstance.y < refreshHeight - 1 && canRefresh) {
              if (canRefresh) {
                _this3.setState({
                  refreshCom: refreshState.init
                });
              }

              _this3.canRefresh = false; // 不刷新
            }
          } // 加载更多


          if (onLoadMore && !loadEnd) {
            if (iScrollInstance.y < iScrollInstance.maxScrollY + 80 && !canLoadMore) _this3.canLoadMore = true; // 可以加载

            if (iScrollInstance.y > iScrollInstance.maxScrollY + 80 && canLoadMore) _this3.canLoadMore = false; // 不加载
          }
        }); // 滚动结束

        iScrollInstance.on('scrollStartEnd', function () {
          var isRefreshIng = _this3.isRefreshIng,
            loadMoreIng = _this3.loadMoreIng,
            onRefresh = _this3.onRefresh,
            canRefresh = _this3.canRefresh,
            refreshState = _this3.refreshState,
            onLoadMore = _this3.onLoadMore,
            loadEnd = _this3.loadEnd,
            canLoadMore = _this3.canLoadMore,
            refreshEnd = _this3.refreshEnd,
            loadMoreEnd = _this3.loadMoreEnd; // 正在加载或者刷新时候直接返回

          if (isRefreshIng || loadMoreIng) return; // 是否可以刷新

          if (canRefresh) {
            _this3.setState({
              refreshCom: refreshState.loading
            });

            _this3.isRefreshIng = true;
            setTimeout(function () {
              onRefresh(_this3, function (type) {
                refreshEnd(type);
              });
            }, 50);
          } // 加载更多


          if (canLoadMore && !loadEnd) {
            _this3.loadMoreIng = true;
            setTimeout(function () {
              onLoadMore(_this, function (type) {
                loadMoreEnd(type);
              });
            }, 50);
          }
        }); // 当前小于整页

        if (init && init.x + init.y !== 0) {
          iScrollInstance.scrollTo(init.x, init.y, 0); // 初次进来,数据没有填充满整个页面，会去请求数据 (加载更多)
        } else if (iScrollInstance.maxScrollY === -1) {
          setTimeout(function () {
            _this.init();
          }, 50);
        }
      }
    }, {
      key: "shouldComponentUpdate",
      value: function shouldComponentUpdate(np) {
        // 组件改变刷新
        var children = this.props.children;
        if (np.children !== children) this.doRefresh = true;
        return true;
      }
    }, {
      key: "componentDidUpdate",
      value: function componentDidUpdate() {
        var doRefresh = this.doRefresh,
          refresh = this.refresh;
        if (doRefresh && refresh) refresh();
        this.doRefresh = false;
      }
    }, {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        var iScrollInstance = this.iScrollInstance;
        var leaveBefor = this.props.leaveBefor;
        if (iScrollInstance.maxScrollY === -1) return;
        if (leaveBefor) leaveBefor(iScrollInstance);
      } // 加载更多完成

    }, {
      key: "loadMoreEnd",
      value: function loadMoreEnd(type) {
        var _this4 = this;

        this.canLoadMore = false;
        setTimeout(function () {
          if (type) _this4.setEnd();

          _this4.iScrollInstance.refresh();

          _this4.loadMoreIng = false;
        }, 50);
      } // 加载完毕

    }, {
      key: "setEnd",
      value: function setEnd() {
        var loadMoreState = this.loadMoreState;
        this.setState({
          loadMoreCom: loadMoreState.end
        });
        this.loadEnd = true;
      } // 刷新iscroll

    }, {
      key: "refresh",
      value: function refresh() {
        var _this5 = this;
        setTimeout(function () {
          _this5 && _this5.iScrollInstance.refresh();
        }, 50);
      } // 下拉刷新结束函数

    }, {
      key: "init",
      value: function init() {
        var _this6 = this;

        var loadEnd = this.loadEnd,
          onLoadMore = this.onLoadMore,
          loadMoreEnd = this.loadMoreEnd;

        if (!loadEnd && onLoadMore) {
          this.loadMoreIng = true;
          setTimeout(function () {
            onLoadMore(_this6, function (type) {
              loadMoreEnd(type);
            });
          }, 50);
        }
      }
    }, {
      key: "render",
      value: function render() {
        var _this7 = this;

        var _this$style = this.style,
          container = _this$style.container,
          boxScroll = _this$style.boxScroll,
          refresh = _this$style.refresh,
          loadMore = _this$style.loadMore;
        var _this$props2 = this.props,
          children = _this$props2.children,
          refreshText = _this$props2.refreshText;
        var _this$state = this.state,
          refreshCom = _this$state.refreshCom,
          loadMoreCom = _this$state.loadMoreCom;
        return _react.default.createElement("div", {
          style: container
        }, _react.default.createElement("div", {
          ref: function ref(r) {
            _this7.boxScroll = r;
          },
          style: boxScroll
        }, _react.default.createElement("div", {
          ref: function ref(r) {
            _this7.box = r;
          }
        }, _react.default.createElement("div", {
          ref: function ref(r) {
            _this7.refreshRef = r;
          },
          style: refresh
        }, refreshCom), children, _react.default.createElement("div", {
          ref: function ref(r) {
            _this7.loadMore = r;
          },
          style: loadMore
        }, loadMoreCom)), _react.default.createElement("div", {
          style: {
            height: 0,
            overflow: 'hidden'
          }
        }, refreshText)));
      }
    }]);

    return AppComponent;
  }(_react.default.Component);

AppComponent.defaultProps = {};
var _default = AppComponent;
exports.default = _default;
