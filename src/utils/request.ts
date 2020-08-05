import axios from 'axios';
import Cookies from 'js-cookie';
import {message} from 'antd';
import router from 'umi/router';

// 端口号4000的是原服务器，7001的是egg的服务器
export const port = 7001;
export const baseURL: string = process.env.NODE_ENV === 'development' ? `http://localhost:${port}/api` : '/api';

const service = axios.create({
  baseURL
});
service.interceptors.request.use(function (config) {
  config.headers['token'] = Cookies.get('token');
  return config;
}, function (error) {
  return Promise.reject(error);
});

service.interceptors.response.use(
  (response: any) => response.data,
  error => {
    const {data} = error.response;
    if (data.code === 'TOKEN_OVERDUE') {
      message.error(data.message);
      router.push('/login');
    }
    return Promise.reject(error);
  }
);

export default service;