import React, {PureComponent} from 'react';
import {Form, Modal, Button, Input, message} from 'antd';
import { connect } from 'dva';
import { FormComponentProps } from 'antd/es/form';
import {AnyObject} from '@/utils/interface';

const FormItem = Form.Item;

interface Props extends FormComponentProps, AnyObject {
  project_id?: string,
  onCancel(b?: boolean): void
};

interface State {
  data: Object
}

class CreateModal extends PureComponent<Props, State> {
  public state = {
    data: {}
  }
  componentDidMount() {
    const {project_id, dispatch} = this.props;
    if (project_id) {
      dispatch({
        type: 'index/getProjectDetail',
        payload: {
          project_id
        }
      })
      .then((res: AnyObject) => {
        this.setState({
          data: res.data
        })
      })
    }
  }

  // 提交
  submit = () => {
    const {project_id, dispatch, form: {validateFields}} = this.props;
    validateFields((err: ErrorEvent, values: AnyObject) => {
      if (err) {
        return;
      }
      if (project_id) {
        dispatch({
          type: 'index/updateProject',
          payload: {
            ...values,
            project_id
          }
        })
        .then(() => {
          message.success('修改成功');
          this.onCancel(true);
        })
      } else {
        dispatch({
          type: 'index/createProject',
          payload: values
        })
        .then(() => {
          message.success('添加成功');
          this.onCancel(true);
        })
      }
    })
  }

  // 关闭弹窗
  onCancel = (submitted?: boolean): void => {
    const {onCancel} = this.props;
    if (typeof onCancel === 'function') {
      onCancel(submitted);
    }
  }
  
  render() {
    const {form: {getFieldDecorator}, project_id} = this.props;
    const {data}:{data: AnyObject} = this.state;
    const preTitle = project_id ? '修改' : '添加';
    return (
      <Modal
        title={`${preTitle}项目`}
        visible
        onCancel={() => {this.onCancel(false)}}
        footer={[
          <Button type="primary" key="submit" onClick={this.submit}>{preTitle}</Button>,
          <Button onClick={() => {this.onCancel(false)}} key="cancel">取消</Button>
        ]}
      >
        <Form>
          <FormItem label="标题">
            {getFieldDecorator('title', {
              rules: [
                {
                  required: true,
                  message: '请输入标题'
                }
              ],
              initialValue: data.title
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
            {getFieldDecorator('desc', {
              initialValue: data.desc
            })(
              <Input />
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

export default Form.create<Props>()(connect()(CreateModal));