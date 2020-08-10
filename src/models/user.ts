import { ModelType } from '@/utils/typings';
import * as userService from '@/services/user';

/**
 * 接口
 */
const Modal:ModelType = {
  namespace: 'user',
  state: {},
  effects: {
    // 登录
    *login({payload}, {call})  {
      const resp = yield call(userService.login, payload);
      return resp;
    },
    // 注册
    *register({payload}, {call})  {
      const resp = yield call(userService.register, payload);
      return resp;
    },
    // 检验用户是否存在
    *checkExists({payload}, {call})  {
      const resp = yield call(userService.checkExists, payload);
      return resp;
    }
  },
  reducers: {}
}

export default Modal;