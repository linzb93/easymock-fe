import React, {SFC, useState} from 'react';
import {Button, Select, message, Form, Input, Row, Col, Card} from 'antd';
import {FormComponentProps} from 'antd/es/form';
import { useDispatch } from 'dva';
import router from 'umi/router';
import MonacoEditor from 'react-monaco-editor';
import {IDispatch, RouterMatch} from '@/utils/interface';
import styles from './index.css';
import { useMount } from 'react-use';

const FormItem = Form.Item;
const {Option} = Select;
const typeList = ['get', 'post', 'delete', 'put', 'patch'];

interface Props extends FormComponentProps {
  match: RouterMatch<{
    project_id: string,
    id: string
  }>
}

const Editor:SFC<Props> = props => {
  const [data, setData]: [any, Function] = useState({});
  const dispatch: IDispatch = useDispatch();
  const {form: {validateFields,getFieldDecorator}, match} = props;
  const {project_id, id} = match.params;

  useMount(() => {
    if (id) {
      dispatch({
        type: 'project/getApiDetail',
        payload: {
          project_id,
          id
        }
      })
      .then((res: any) => {
        setData(res.data);
      });
    }
  });

  // 代码变化
  function changeCode (val: string) {
    setData({
      ...data,
      code: val
    });
  }

  // 提交
  function submit () {
    validateFields((err, values: object) => {
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
      if (!id) {
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
          goBack();
        })
      } else {
        dispatch({
          type: 'project/updateApi',
          payload: {
            project_id,
            id,
            ...values,
            code: data.code
          }
        })
        .then(() => {
          message.success('编辑成功');
          goBack();
        })
      }
    });
  }

  // 返回上一页
  function goBack() {
    router.goBack();
  }

  return (
    <div className="wrapper full-height">
      <div className={styles['left-config']}>
        <Card className={styles['config-form-wrapper']}>
          <Form>
            <FormItem label="名称">
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '请输入标题'
                  }
                ],
                initialValue: data.name
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
                <Button type="primary" block onClick={submit}>保存</Button>
              </Col>
              <Col span={11} offset={2}>
                <Button block onClick={goBack}>取消</Button>
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
          onChange={changeCode}
        />
      </div>
    </div>
  )
}

export default Form.create()(Editor);