import {stringify} from 'qs';
import service, {baseURL} from '../utils/request';
import {AnyObject} from '@/utils/interface';

/**
 * 接口
 */
// 获取接口地址
export function getApiPage(params: AnyObject) {
  return service.get(`/api/page?${stringify(params)}`);
}
// 预览接口
export function getApiPreview(params: AnyObject) {
  return service[params.type](`/api/preview?${stringify(params)}`);
}
// 创建接口
export function createApi(params: AnyObject) {
  return service.post(`/api/create`, {
    ...params
  })
}
// 更新接口
export function updateApi(params: AnyObject) {
  return service.post(`/api/update`, {
    ...params
  })
}
// 获取接口详情
export function getApiDetail(params: AnyObject) {
  return service.get(`/api/detail?${stringify(params)}`);
}
// 删除接口
export function deleteApi(params: AnyObject) {
  return service.post(`/api/delete`, {
    ...params
  });
}
// 导出所有接口
export function exportApi(params: AnyObject) {
  return `${baseURL}/api/download?${stringify(params)}`
}
// 复制接口
export function cloneApi(params: AnyObject) {
  return service.post(`/api/clone`, {
    ...params
  });
}