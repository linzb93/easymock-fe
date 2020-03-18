import {useMount, useSetState} from 'react-use';
import {useDispatch} from 'dva';
import {IDispatch} from './interface';

// Table hook
export function useTable(option: any) {
  const dispatch: IDispatch = useDispatch();
  const [data, setData] = useSetState({
    loading: true,
    data: [],
    current: 1,
    total: 0,
    searchParams: {}
  });
  const {type, pageSize, payload, ...restProps} = option;

  useMount(() => {
    getData(data.current);
  });

  function getData(cur: number) {
    dispatch({
      type,
      payload: {
        ...payload,
        ...data.searchParams,
        size: pageSize,
        page: cur
      }
    })
    .then((res: any) => {
      setData({
        loading: false,
        data: res.data.list,
        current: cur,
        total: res.data.total
      });
    });
  }

  function changePagination(cur: number) {
    setData({
      loading: true
    });
    getData(cur);
  }

  // 刷新
  function fresh() {
    setData({
      loading: true
    });
    getData(data.current);
  }

  // 传入搜索参数
  function search(params: object) {
    setData({
      searchParams: params,
      current: 1
    });
    getData(1);
  }

  return {
    loading: data.loading,
    dataSource: data.data,
    bordered: true,
    fresh,
    search,
    pagination: {
      current: data.current,
      defaultCurrent: data.current,
      showTotal: (total: number) => `共 ${total} 条记录`,
      pageSize: pageSize,
      total: data.total,
      onChange: changePagination
    },
    ...restProps
  }
}