import { ModelType } from '@/utils/typings';
import * as indexService from '@/services';

/**
 * 项目
 */
const Modal:ModelType = {
  namespace: 'index',
  state: {},
  effects: {
    // 获取项目列表
    *getProjectList(_, {call})  {
      const resp = yield call(indexService.getProjectList);
      return resp;
    },
    // 创建项目
    *createProject({payload}, {call})  {
      const resp = yield call(indexService.createProject, payload);
      return resp;
    },
    // 编辑项目
    *updateProject({payload}, {call})  {
      const resp = yield call(indexService.updateProject, payload);
      return resp;
    },
    // 获取项目详情
    *getProjectDetail({payload}, {call})  {
      const resp = yield call(indexService.getProjectDetail, payload);
      return resp;
    },
    // 删除项目
    *deleteProject({payload}, {call})  {
      const resp = yield call(indexService.deleteProject, payload);
      return resp;
    }
  },
  reducers: {}
}

export default Modal;