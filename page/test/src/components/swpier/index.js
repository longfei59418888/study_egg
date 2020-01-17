import React from 'react';
import Swiper from 'swiper/dist/js/swiper';
import 'swiper/dist/css/swiper.min.css';
import './index.scss';
import names from 'classnames';

class Com extends React.Component {
  componentDidMount() {
    const { pagination, box, props } = this;

    const options = {
      loop: true,
      pagination: {
        el: pagination,
      },
    };

    const { option, swipe = false } = props;
    if (swipe) this.swiperCom = new Swiper(box, { ...options, ...option });
  }
  componentDidUpdate() {
    const { swipe } = this.props;
    if (swipe) this.swiperCom.update();
  }

  render() {
    const { children, className } = this.props;
    return (
      <div
        ref={(ref) => { this.box = ref; }}
        className={names('jt--com-swiper ofh pos-r', className)}>
        <div className="swiper-wrapper">
          {children}
        </div>
        <div ref={(ref) => { this.pagination = ref; }} className="swiper-pagination" />
      </div>
    );
  }
}

export default Com;
