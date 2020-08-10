import {useState} from 'react';
import {useDispatch} from 'dva';
import {AnyObject} from '../typings';
import {IDispatch} from '../typings';

export default function useFetch(type: string) {
  const dispatch: IDispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({} as AnyObject);
  
  function getData(payload: any) {
    setLoading(true);
    dispatch({
      type,
      payload
    })
    .then((res:AnyObject) => {
      setData(res.data);
      setLoading(false);
    });
  }
  return {
    data,
    loading,
    getData
  }
}