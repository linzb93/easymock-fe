import { Effect } from 'dva';

export interface AnyObject {
  [propName: string]: any;
}

// redux modal
export interface ModelType {
  namespace: string;
  state: object;
  effects: {
    [name: string]: Effect;
  };
  reducers: object
}

// 组件里面的dispatch
export interface IDispatch {
  ({type, payload}: {type: string, payload?: object}): Promise<object>
}