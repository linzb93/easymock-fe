import {stringify} from 'qs';
import service, {baseURL} from '../utils/request';

/**
 * 项目
 */

// 获取项目列表
export function getProjectList() {
  return service.get('/project/list');
}
// 创建项目
export function createProject(params: object) {
  return service.post('/project/create', {
    ...params
  });
}
// 编辑项目
export function updateProject(params: object) {
  return service.post('/project/update', {
    ...params
  });
}
// 获取项目详情
export function getProjectDetail(params: object) {
  return service.get(`/project/detail?${stringify(params)}`);
}
// 删除项目
export function deleteProject(params: object) {
  return service.post('/project/delete', {
    ...params
  });
}
// 导入项目的接口地址
export const uploadProjectUrl = `${baseURL}/project/upload`;

// 文件下载
export function fileDownload(params: object) {
  return `${baseURL}/download?${stringify(params)}`
}