import service from '../utils/request';
import {stringify} from 'qs';

/**
 * 用户
 */

// 登录
export function login(params: any) {
  return service.post('/user/login', params);
}
// 注册
export function register(params: any) {
  return service.post('/user/register', params);
}
// 检验用户是否存在
export function checkExists(params: any) {
  return service.get(`/user/checkExists?${stringify(params)}`)
}