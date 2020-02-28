import { ModelType } from '@/utils/interface';
import * as projectService from '@/services/project';

/**
 * 接口
 */
const Modal:ModelType = {
  namespace: 'project',
  state: {},
  effects: {
    // 获取接口地址
    *getApiPage({payload}, {call})  {
      const resp = yield call(projectService.getApiPage, payload);
      return resp;
    },
    // 预览接口
    *getApiPreview({payload}, {call})  {
      const resp = yield call(projectService.getApiPreview, payload);
      return resp;
    },
    // 创建接口
    *createApi({payload}, {call})  {
      const resp = yield call(projectService.createApi, payload);
      return resp;
    },
    // 更新接口
    *updateApi({payload}, {call})  {
      const resp = yield call(projectService.updateApi, payload);
      return resp;
    },
    // 获取接口详情
    *getApiDetail({payload}, {call})  {
      const resp = yield call(projectService.getApiDetail, payload);
      return resp;
    },
    // 删除接口
    *deleteApi({payload}, {call})  {
      const resp = yield call(projectService.deleteApi, payload);
      return resp;
    },
    // 复制接口
    *cloneApi({payload}, {call})  {
      const resp = yield call(projectService.cloneApi, payload);
      return resp;
    }
  },
  reducers: {}
}

export default Modal;