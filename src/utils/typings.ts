import { AnyAction } from 'redux';
import {AxiosResponse} from 'axios';
import {EffectsCommandMap} from 'dva';

export interface AnyObject {
  [key: string]: any
}

// redux modal
interface PromiseFunc {
  (arg?:any): Promise<any>
}
interface EffectsCommandMapExtends extends EffectsCommandMap {
  call(request: PromiseFunc, payload?:any): Promise<any>,
  put(arg: SagaDispatch): void
}
export interface ModelType {
  namespace: string;
  state: object;
  effects: {
    [name: string]: (action: AnyAction, effects: EffectsCommandMapExtends) => void;
  };
  reducers: {
    [name: string]: (state: object, payload?:any) =>object
  }
}

// 组件里面的dispatch
interface SagaDispatch {
  type: string,
  payload?: object
}
export interface IDispatch {
  (arg: SagaDispatch): Promise<Response>
}

// router
export interface RouterMatch<T> {
  params: T
}

// response
export type Response = AxiosResponse <{
  message: string,
  code?: string | number,
  data?: any
}>;