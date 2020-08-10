import React, {SFC} from 'react';
import {Form,Button,Card,Input,message,Modal} from 'antd';
import {FormComponentProps} from 'antd/es/form';
import router from 'umi/router';
import { useDispatch } from 'dva';
import Cookies from 'js-cookie';
import {IDispatch} from '@/utils/typings';
import styles from './index.css';

interface Props extends FormComponentProps {}

const FormItem = Form.Item;
const formlayout = {
  labelCol: {
    span: 4
  },
  wrapperCol: {
    span: 20
  }
}
const Index:SFC<Props> = props => {
  const {form: {validateFields,getFieldDecorator}} = props;
  const dispatch: IDispatch = useDispatch();

  // 登录
  function submit(e:any) {
    e.preventDefault();
    validateFields((err, values: object) => {
      if (err) {
        return;
      }
      dispatch({
        type: 'user/login',
        payload: values
      })
      .then(({data}) => {
        // 如果账号不存在
        if (data.code === 2) {
          Modal.confirm({
            title: '提示',
            content: '账号不存在，是否注册一个新账号？',
            onOk: () => {
              makeRegister(values);
            }
          });
        } else if (data.code === 1) {
          message.error('密码错误');
        } else {
          Cookies.set('token', data.data.token);
          router.push('/');
          message.success('登录成功');
        }
      });
    })
  }

  // 注册
  function makeRegister(values: object) {
    dispatch({
      type: 'user/register',
      payload: values
    })
    .then(({data}) => {
      Cookies.set('token', data.data.token);
      router.push('/');
      message.success('注册成功');
      
    });
  }

  return (
    <div className="wrapper full-height">
      <div className={styles['login-wrapper']}>
        <div className={styles['login-box']}>
          <Card title="登录" style={{width: '100%'}}>
            <Form onSubmit={submit} {...formlayout}>
              <FormItem label="用户名">
                {getFieldDecorator('name', {
                  rules: [
                    {
                      required: true,
                      message: '请输入用户名'
                    }
                  ]
                })(
                  <Input />
                )}
              </FormItem>
              <FormItem label="密码">
                {getFieldDecorator('password', {
                  rules: [
                    {
                      required: true,
                      message: '请输入密码'
                    }
                  ]
                })(
                  <Input.Password />
                )}
              </FormItem>
              <div style={{textAlign: 'center'}}>
                <Button type="primary" htmlType="submit">登录</Button>
              </div>
            </Form>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Form.create()(Index);