import React from 'react';
import history from 'src/utils/init/history';
import Head from './index';


const Com = (props) => {
  const {
    left = {
      text: 'back',
      onClick: () => history.goBack(),
    },
    right = null, className, title,
  } = props;
  return (
    <Head
      style={className}
      left={[left]}
      title={title}
      right={right ? [right] : []} />
  );
};


export default Com;
