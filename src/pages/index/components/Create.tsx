import React, {SFC, useState} from 'react';
import {Form, Modal, Button, Input, message, Tag} from 'antd';
import { useDispatch } from 'dva';
import {useMount} from 'react-use';
import { FormComponentProps } from 'antd/es/form';
import {IDispatch} from '@/utils/interface';
import CollaboratorManage from './CollaboratorManage';

const FormItem = Form.Item;

interface Props extends FormComponentProps {
  id?: string,
  onCancel(b?: boolean): void
};

const CreateModal:SFC<Props> = props => {
  const {id, onCancel, form: {getFieldDecorator, validateFields}} = props;
  const dispatch: IDispatch = useDispatch();
  const [data, setData]: [any, Function] = useState({
    collaborators: ''
  });
  const preTitle = id ? '修改' : '添加';

  useMount(() => {
    if (id) {
      dispatch({
        type: 'index/getProjectDetail',
        payload: {
          id
        }
      })
      .then((res: any) => {
        setData(res.data);
      })
    }
  });

  // 提交
  function submit() {
    validateFields((err, values: object) => {
      if (err) {
        return;
      }
      if (id) {
        dispatch({
          type: 'index/updateProject',
          payload: {
            ...values,
            id
          }
        })
        .then(() => {
          message.success('修改成功');
          onCancel(true);
        })
      } else {
        dispatch({
          type: 'index/createProject',
          payload: values
        })
        .then(() => {
          message.success('添加成功');
          onCancel(true);
        })
      }
    })
  }

  return (
    <Modal
      title={`${preTitle}项目`}
      visible
      onCancel={() => {onCancel(false)}}
      footer={[
        <Button type="primary" key="submit" onClick={submit}>{preTitle}</Button>,
        <Button onClick={() => {onCancel(false)}} key="cancel">取消</Button>
      ]}
    >
      <Form>
        <FormItem label="标题">
          {getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: '请输入标题'
              }
            ],
            initialValue: data.name
          })(
            <Input />
          )}
        </FormItem>
        <FormItem label="前缀">
          {getFieldDecorator('prefix', {
            initialValue: data.prefix
          })(
            <Input />
          )}
        </FormItem>
        <FormItem label="简介">
          {getFieldDecorator('description', {
            initialValue: data.description
          })(
            <Input />
          )}
        </FormItem>
        {id && (
          <FormItem label="协作者">
            {getFieldDecorator('collaborators', {
              initialValue: data.collaborators
            })(
              <CollaboratorManage />
            )}
          </FormItem>
        )}
      </Form>
    </Modal>
  )
}

export default Form.create<Props>()(CreateModal);