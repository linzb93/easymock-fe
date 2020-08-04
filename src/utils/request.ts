import axios from 'axios';
import Cookies from 'js-cookie';

// 端口号4000的是原服务器，7001的是egg的服务器
export const port = 7001;
export const baseURL: string = process.env.NODE_ENV === 'development' ? `http://localhost:${port}/api` : '/api';

const service = axios.create({
  baseURL,
  headers: {
    token: Cookies.get('token')
  }
});
service.interceptors.response.use(
  (response: any) => response.data,
  error => Promise.reject(error)
);

export default service;