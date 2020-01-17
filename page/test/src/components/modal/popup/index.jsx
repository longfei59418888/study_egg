/**
 * popup
 * @author Xiaolong
 */
import React from 'react';
import ReactDOM, { render } from 'react-dom';
import { Modal } from 'antd-mobile';


class Container extends React.Component {
  state = {
    isShow: false,
  };

  componentDidMount() {
    Modal.defaultProps.wrapClassName = 'jt-common-modal-common-popup-one';
    this.setState({
      isShow: true,
    });
  }

  close = () => {
    this.setState({
      isShow: false,
    });
    modalContainer.parentNode.removeChild(modalContainer);
    modalContainer = null;
    setTimeout(() => {
      Modal.defaultProps.wrapClassName = '';
    }, 300);
  }

  render() {
    const { onClose = () => {}, children } = this.props;
    const { isShow } = this.state;
    return (
      <Modal
        visible={isShow}
        transparent
        maskClosable
        popup
        animationType="slide-up"
        onClose={() => {
          onClose();
          this.close();
        }}>
        {children}
      </Modal>
    );
  }
}

let modalContainer = null;
let popupCom = null;

function addContainer() {
  if (modalContainer) return;
  modalContainer = document.createElement('div');
  document.body.appendChild(modalContainer);
}


const popup = (Com, opiton = {}) => {
  const defaultOpiton = {
    bak: null,
    title: null,
    onClose: () => {
    },
    afterClose: () => {
    },
    ref: (com) => {
      popupCom = com;
    },
  };
  opiton = { ...defaultOpiton, ...opiton };
  addContainer();
  if (modalContainer) ReactDOM.unmountComponentAtNode(modalContainer);
  render(<Container {...opiton}>{Com}</Container>, modalContainer, opiton.bak);
  return () => { popupCom.close(); };
};

export const getModalList = () => (modalContainer ? popupCom.close : null);
export default popup;
