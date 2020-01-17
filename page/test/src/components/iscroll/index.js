import React from 'react';
import IScroll from './iscroll-probe.js';


class AppComponent extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.style = {
      container: {
        height: '100%',
        width: '100%',
        overflow: 'hidden',
        position: 'absolute',
      },
      boxScroll: {
        position: 'absolute',
        top:  0,
        width: '100%',
        overflow: 'hidden',
        bottom: 0,
      }
    };
  }
  componentDidMount() {
    const { box, boxScroll } = this;
    const { init, onScroll = null, bounce=false } = this.props;
    this.iScrollInstance = new IScroll(boxScroll, {
      probeType: 3,
      mouseWheel: true,
      disablePointer: true,
      disableTouch: false,
      disableMouse: false,
      bounce,
      preventDefault: false,
    });

    const { iScrollInstance } = this;

    // 滚动中
    iScrollInstance.on('scroll', () => {
      if (onScroll) onScroll(iScrollInstance);
    });
    if (init && (init.x + init.y) !== 0) {
      iScrollInstance.scrollTo(init.x, init.y, 0);
    }

  }

  componentDidUpdate() {
    setTimeout(() => { this.iScrollInstance.refresh(); }, 50);
  }

  componentWillUnmount() {
    const { iScrollInstance } = this;
    const { leaveBefor } = this.props;
    if (leaveBefor) leaveBefor(iScrollInstance);
  }

  render() {
    const {
      container, boxScroll
    } = this.style;
    const { children,refreshText } = this.props;
    return (
      <div style={container}>
        <div ref={(r) => { this.boxScroll = r; }} style={boxScroll}>
          <div ref={(r) => { this.box = r; }}>
            {children}
          </div>
        </div>
        <div style={{height:0,overflow:'hidden'}}>{refreshText}</div>
      </div>
    );
  }
}

AppComponent.defaultProps = {};

export default AppComponent;
