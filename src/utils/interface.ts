import { Effect } from 'dva';

export interface AnyObject {
  [propName: string]: any;
}

// redux modal
export interface ModelType {
  namespace: string;
  state: any;
  effects: {
    [name: string]: Effect;
  };
  reducers: any
}