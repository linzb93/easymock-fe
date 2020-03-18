import React, {SFC, useEffect} from 'react';
import { useDispatch } from 'dva';
import {IDispatch} from '@/utils/interface';

const Origin:SFC = () => {
  const dispatch:IDispatch = useDispatch();
  useEffect(() => {
    dispatch({
      type: 'index/getOrigin'
    })
    .then(res => {
      console.log(res);
    })
  }, []);
  return <div />
}
export default Origin;