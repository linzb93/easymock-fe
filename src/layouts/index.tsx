import React, {Fragment} from 'react';
import styles from './index.css';

const BasicLayout: React.FC = props => {
  return <Fragment>{props.children}</Fragment>
};

export default BasicLayout;
