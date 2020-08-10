import React, {SFC, useState} from 'react';
import {Table, Button, message} from 'antd';
import {ColumnProps} from 'antd/es/table';
import { useDispatch } from 'dva';
import {useMount} from 'react-use';
import CreateModal from './components/Create';
import ImportModal from './components/Import';
import {Link} from 'react-router-dom';
import {IDispatch} from '@/utils/typings';

const Index:SFC = () => {
  const [createModalVisible, setCreateModalVisible] = useState(false); // 创建弹窗显示
  const [importModalVisible, setImportModalVisible] = useState(false); // 导入弹窗显示
  const [data, setData] = useState([]); // table数据
  const dispatch: IDispatch = useDispatch();
  const [id, setId] = useState(''); // project id

  const columns:ColumnProps<{
    id: string
  }>[] = [
    {
      title: '名称',
      dataIndex: 'name',
      render: (text, record) => (
        <Link to={`/project/${record.id}`}>{text}</Link>
      )
    },
    {
      title: '接口地址',
      dataIndex: 'prefix'
    },
    {
      title: '接口数',
      dataIndex: 'count'
    },
    {
      title: '操作',
      render: (_, record) => (
        <div className="table-opr-wrap">
          <Button type="primary" size="small" onClick={() => {edit(record.id)}}>编辑</Button>
          <Button type="danger" size="small" onClick={() => {deleteItem(record.id)}}>删除</Button>
        </div>
      )
    }
  ]

  useMount(() => {
    getProjectList();
  });

  // 获取列表
  function getProjectList() {
    dispatch({
      type: 'index/getProjectList'
    })
    .then(({data}) => {
      setData(data.data);
    });
  }

  // 编辑
  function edit(id: string) {
    setCreateModalVisible(true);
    setId(id);
  }

  // 删除
  function deleteItem(id: string) {
    dispatch({
      type: 'index/deleteProject',
      payload: {
        id
      }
    })
    .then(({data}) => {
      if (data.data) {
        message.success('删除成功');
        getProjectList();
      } else {
        message.error(data.message);
      }
    });
  }

  // 弹窗关闭
  function changeModalVisible(name: 'create' | 'import', reloaded: boolean) {
    if (name === 'create') {
      setCreateModalVisible(false);
    } else if (name === 'import') {
      setImportModalVisible(false);
    }
    if (reloaded) {
      getProjectList();
    }
  }

  return (
    <div className="wrapper">
      <div className="table-filter">
        <Button type="primary" onClick={() => {setCreateModalVisible(true);}}>添加项目</Button>
        <Button type="primary" onClick={() => {setImportModalVisible(true);}}>导入项目</Button>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        rowKey="id"
        bordered
      />
      {createModalVisible && (
        <CreateModal
          onCancel={(reloaded: boolean) => {changeModalVisible('create', reloaded)}}
          id={id}
        />
      )}
      {importModalVisible && (
        <ImportModal
          onCancel={(reloaded: boolean) => {changeModalVisible('import', reloaded)}}
        />
      )}
    </div>
  )
}

export default Index;