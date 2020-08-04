import React, {SFC, useState} from 'react';
import {Input, Tag, message} from 'antd';
import {clone} from 'lodash';
import { useDispatch } from 'dva';
import {IDispatch} from '@/utils/interface';

interface Props {
  value?: any,
  onChange?: any
};

const CollaboratorManage:SFC<Props> = props => {
  const {value, onChange} = props;
  const cols = value !== '' ? value.split(',') : [];
  const [inputVal, setInputVal] = useState('');
  const dispatch: IDispatch = useDispatch();
  // 检验用户是否存在
  function checkCollaborator(e:any) {
    const val = e.target.value;
    if (val === '') {
      return;
    }
    dispatch({
      type: 'user/checkExists',
      payload: {
        name: val,
        excludeCurUser: true
      }
    })
    .then((res: any) => {
      if (res.data) {
        onChange(cols.concat(val).join(','));
      } else {
        message.error(res.message);
      }
      setInputVal('');
    })
  }
  // 移除协作者
  function removeCollaborator(index: number) {
    const arr = clone(cols);
    arr.splice(index, 1);
    onChange(arr.join(','));
  }

  return (
    <>
    {cols.map((item: string, index: number) => (
      <Tag closable onClose={() => removeCollaborator(index)}>{item}</Tag>
    ))}
    <Input
      value={inputVal}
      onChange={e => {setInputVal(e.target.value)}}
      onPressEnter={checkCollaborator}
      />
    </>
  )
}

export default CollaboratorManage;