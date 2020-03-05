import React, {SFC, useState, ReactNode} from 'react';
import {Table, Button, message} from 'antd';
import { useDispatch } from 'dva';
import {useMount} from 'react-use';
import CreateModal from './components/Create';
import ImportModal from './components/Import';
import {Link} from 'react-router-dom';
import {IDispatch} from '@/utils/interface';

interface TableItem {
  title: string,
  dataIndex?: string,
  key?: string,
  render?: (text: string, record: {project_id: string}) => ReactNode
}

const Index:SFC = () => {
  const [createModalVisible, toggleCreateModalVisible] = useState(false); // 创建弹窗显示
  const [importModalVisible, toggleImportModalVisible] = useState(false); // 导入弹窗显示
  const [data, setData] = useState([]); // table数据
  const dispatch: IDispatch = useDispatch();
  const [project_id, setProjectId] = useState(''); // project_id

  const columns:TableItem[] = [
    {
      title: '名称',
      dataIndex: 'title',
      render: (text, record) => (
        <Link to={`/project/${record.project_id}`}>{text}</Link>
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
          <Button type="primary" size="small" onClick={() => {edit(record.project_id)}}>编辑</Button>
          <Button type="danger" size="small" onClick={() => {deleteItem(record.project_id)}}>删除</Button>
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
    .then((res: any) => {
      setData(res.data);
    });
  }

  // 编辑
  function edit(id: string) {
    toggleCreateModalVisible(true);
    setProjectId(id);
  }

  // 删除
  function deleteItem(id: string) {
    dispatch({
      type: 'index/deleteProject',
      payload: {
        project_id: id
      }
    })
    .then(() => {
      message.success('删除成功');
      getProjectList();
    });
  }

  // 弹窗关闭
  function changeModalVisible(name: 'create' | 'import', reloaded: boolean) {
    if (name === 'create') {
      toggleCreateModalVisible(false);
    } else if (name === 'import') {
      toggleImportModalVisible(false);
    }
    if (reloaded) {
      getProjectList();
    }
  }

  return (
    <div className="wrapper">
      <div className="table-filter">
        <Button type="primary" onClick={() => {toggleCreateModalVisible(true);}}>添加项目</Button>
        <Button type="primary" onClick={() => {toggleImportModalVisible(true);}}>导入项目</Button>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        rowKey="project_id"
        bordered
      />
      {createModalVisible && (
        <CreateModal
          onCancel={(reloaded: boolean) => {changeModalVisible('create', reloaded)}}
          project_id={project_id}
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