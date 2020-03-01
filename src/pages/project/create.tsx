import React, {PureComponent} from 'react';
import {Button, Select, message, Form, Input, Row, Col, Card} from 'antd';
import { connect } from 'dva';
import MonacoEditor from 'react-monaco-editor';
import {AnyObject} from '@/utils/interface';
import styles from './index.css';

const FormItem = Form.Item;
const {Option} = Select;
const typeList = ['get','post', 'delete', 'put', 'patch'];

interface Props extends AnyObject {}
interface State extends AnyObject {}

class Editor extends PureComponent<Props, State> {
  state = {
    data: {},
    api_id: '',
    project_id: ''
  }
  componentDidMount() {
    const {dispatch} = this.props;
    this.setState({
      project_id: this.props.match.params.project_id,
      api_id: this.props.match.params.api_id
    }, () => {
      const {api_id, project_id} = this.state;
      if (api_id) {
        dispatch({
          type: 'project/getApiDetail',
          payload: {
            project_id,
            api_id
          }
        })
        .then((res: AnyObject) => {
          this.setState({
            data: res.data
          })
        })
      }
    });
  }
  changeCode = (val: string) => {
    this.setState(prevState => ({
      data: {
        ...prevState.data,
        code: val
      }
    }))
  }
  submit = () => {
    const {form: {validateFields}, dispatch} = this.props;
    const {project_id, api_id, data}: {data: AnyObject, [name:string]: any} = this.state;
    validateFields((err: ErrorEvent, values: AnyObject) => {
      if (err) {
        return;
      }
      if (!data.code) {
        message.error('请输入代码');
        return;
      }
      try {
        JSON.parse(data.code);
      } catch (e) {
        message.error('代码格式不正确');
        return;
      }
      if (!api_id) {
        dispatch({
          type: 'project/createApi',
          payload: {
            project_id,
            ...values,
            code: data.code
          }
        })
        .then(() => {
          message.success('添加成功');
          this.back();
        })
      } else {
        dispatch({
          type: 'project/updateApi',
          payload: {
            project_id,
            api_id,
            ...values,
            code: data.code
          }
        })
        .then(() => {
          message.success('编辑成功');
          this.back();
        })
      }
    });
  }
  back = () => {
    const {history} = this.props;
    history.goBack();
  }
  render() {
    const {form: {getFieldDecorator}} = this.props;
    const {data}: {data:AnyObject} = this.state;
    return (
      <div className="wrapper full-height">
        <div className={styles['left-config']}>
          <Card className={styles['config-form-wrapper']}>
            <Form>
              <FormItem label="名称">
                {getFieldDecorator('title', {
                  rules: [
                    {
                      required: true,
                      message: '请输入标题'
                    }
                  ],
                  initialValue: data.title
                })(
                  <Input placeholder="请输入标题" />
                )}
              </FormItem>
              <FormItem label="方式">
                {getFieldDecorator('type', {
                  initialValue: data.type || 'get'
                })(
                  <Select placeholder="请选择请求方式">
                    {typeList.map(item => (
                      <Option value={item} key={item}>{item}</Option>
                    ))}
                  </Select>
                )}
              </FormItem>
              <FormItem label="地址">
                {getFieldDecorator('url', {
                  rules: [
                    {
                      required: true,
                      message: '请输入地址'
                    }
                  ],
                  initialValue: data.url
                })(
                  <Input placeholder="请输入地址" />
                )}
              </FormItem>
              <Row>
                <Col span={11}>
                  <Button type="primary" block onClick={this.submit}>保存</Button>
                </Col>
                <Col span={11} offset={2}>
                  <Button block onClick={this.back}>取消</Button>
                </Col>
              </Row>
            </Form>
          </Card>
        </div>
        <div className={styles['code-con']}>
          <MonacoEditor
            width="800"
            height="100%"
            language="javascript"
            theme="vs-dark"
            options={{
              fontSize: 16
            }}
            value={data.code}
            onChange={this.changeCode}
          />
        </div>
      </div>
    )
  }
}

export default Form.create()(connect()(Editor));