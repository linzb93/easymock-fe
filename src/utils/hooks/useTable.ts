import {useMount, useSetState} from 'react-use';
import {AnyObject} from '../interface';
import useFetch from './useFetch';

// Table hook
export default function useTable(option: AnyObject) {
  const {
    payload,
    pageSize = 10,
    type
  } = option;
  const {loading, data, getData: fetch} = useFetch(type);
  const [state, setState] = useSetState({
    current: 1,
    searchParams: {}
  });

  useMount(() => {
    fetch({
      ...payload,
      ...state.searchParams,
      size: pageSize,
      page: state.current
    });
  });

  function onChange(current: number) {
    fetch({
      ...payload,
      ...state.searchParams,
      size: pageSize,
      page: current
    });
    setState({
      current
    });
  }

  function fresh() {
    fetch({
      ...payload,
      ...state.searchParams,
      size: pageSize,
      page: state.current
    });
  }

  function search(params: AnyObject) {
    fetch({
      ...payload,
      ...state.searchParams,
      size: pageSize,
      page: 1
    });
    setState({
      searchParams: params,
      current: 1
    });
  }

  return {
    loading,
    dataSource: data.list,
    bordered: true,
    fresh,
    search,
    pagination: {
      current: state.current,
      defaultCurrent: state.current,
      showTotal: (total: number) => `共${total}条记录`,
      pageSize,
      total: data.total,
      onChange
    }
  }
}