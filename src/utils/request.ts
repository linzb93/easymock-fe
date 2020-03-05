import axios from 'axios';

export const baseURL: string = process.env.NODE_ENV === 'development' ? 'http://localhost:4000/api' : '/api';

const service = axios.create({
  baseURL
});
service.interceptors.response.use(
  (response: any) => response.data,
  (error: ErrorEvent) => Promise.reject(error)
);

export default service;