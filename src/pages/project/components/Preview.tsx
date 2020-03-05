import React, {SFC, useState} from 'react';
import {Modal} from 'antd';
import { useDispatch } from 'dva';
import {useMount} from 'react-use';
import {AnyObject, IDispatch} from '@/utils/interface';

interface Props extends AnyObject {
  
}
const Preview:SFC<Props> = props => {
  const [data, setData] = useState('');
  const dispatch:IDispatch = useDispatch();
  const {project_id, api_id, onCancel} = props;
  useMount(() => {
    dispatch({
      type: 'project/getApiPreview',
      payload: {
        project_id,
        api_id
      }
    })
    .then((res: AnyObject) => {
      setData(JSON.stringify(res.data, null, 4));
    });
  });
  return (
    <Modal
      title="接口预览"
      visible
      footer={null}
      onCancel={() => {onCancel()}}
    >
      <div style={{whiteSpace: 'pre-wrap'}}>{data}</div>
    </Modal>
  )
}
export default Preview;