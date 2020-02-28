import React, {PureComponent} from 'react';
import {Modal} from 'antd';
import { connect } from 'dva';
import {AnyObject} from '@/utils/interface';

interface Props extends AnyObject {
  
}
class Preview extends PureComponent<Props> {
  state = {
    data: ''
  };
  componentDidMount() {
    const {project_id, api_id, type, dispatch} = this.props;
    dispatch({
      type: 'project/getApiPreview',
      payload: {
        project_id,
        api_id,
        type
      }
    })
    .then((res: AnyObject) => {
      this.setState({
        data: JSON.stringify(res.data, null, 4)
      })
    })
  }
  render() {
    const {onCancel} = this.props;
    const {data} = this.state;
    return (
      <Modal
        title="接口预览"
        visible
        footer={null}
        onCancel={onCancel}
      >
        <div style={{whiteSpace: 'pre-wrap'}}>{data}</div>
      </Modal>
    )
  }
}

export default connect()(Preview);