import React, {SFC, useState} from 'react';
import {Table, Button, message, Typography, Tag, Form, Input} from 'antd';
import { useDispatch } from 'dva';
import {useMount} from 'react-use';
import router from 'umi/router';
import copy from 'copy-to-clipboard';
import Preview from './components/Preview';
import {useTable} from '@/utils/hooks';
import {AnyObject,IDispatch} from '@/utils/interface';
import {exportApi} from '@/services/project';

const {Text, Paragraph, Title} = Typography;

function TypeTag({type}:{type:'get'|'post'|'delete'|'patch'|'put'}) {
  const typeMap = {
    get: 'blue',
    post: 'green',
    delete: 'red',
    patch: 'purple',
    put: 'cyan'
  };
  return <Tag color={typeMap[type]}>{type}</Tag>
}

interface Props extends AnyObject {
}

const List:SFC<Props> = props => {
  const {form: {getFieldsValue, getFieldDecorator}, match} = props;
  const {project_id} = match.params;
  const dispatch: IDispatch = useDispatch();
  const { fresh, search, ...tableProps } = useTable({
    type: 'project/getApiPage',
    payload: {
      project_id
    },
    pageSize: 5
  });
  
  const [meta, setMeta]: [AnyObject, Function] = useState({});
  const [previewModalVisible, togglePreviewModalVisible] = useState(false);
  const [api_id, setApiId] = useState('');
  
  const columns = [
    {
      title: '名称',
      dataIndex: 'title',
      width: '25%'
    },
    {
      title: '地址',
      dataIndex: 'url',
      width: '25%'
    },
    {
      title: '方法',
      dataIndex: 'type',
      render: (text: string) => <TypeTag type={text} />,
      width: '10%'
    },
    {
      title: '操作',
      render: (text: string, record: AnyObject) => (
        <div className="table-opr-wrap">
          <Button type="primary" size="small" onClick={() => {edit(record.id)}}>编辑</Button>
          <Button type="primary" size="small" onClick={() => {preview(record.id)}}>预览</Button>
          <Button type="primary" size="small" onClick={() => {clone(record.id)}}>克隆</Button>
          <Button type="primary" size="small" onClick={() => {copyToClipboard(record.url)}}>复制接口地址</Button>
          <Button type="danger" size="small" onClick={() => {deleteItem(record.id)}}>删除</Button>
        </div>
      )
    }
  ];

  useMount(() => {
    dispatch({
      type: 'index/getProjectDetail',
      payload: {
        project_id
      }
    })
    .then((res: any) => {
      setMeta({
        ...res.data,
        prefix: `${project_id}${res.data.prefix}`
      });
    });
  });

  // 复制项目地址
  function copyToClipboard (url: string) {
    copy(`${window.location.hostname}:4000/mock/${meta.prefix}${url}`);
    message.success('接口复制成功');
  }

  // 添加接口
  function add () {
    router.push(`/project/${project_id}/create`);
  };

  // 编辑接口
  function edit (id: string) {
    router.push(`/project/${project_id}/update/${id}`);
  }

  // 删除接口
  function deleteItem (id: string) {
    dispatch({
      type: 'project/deleteApi',
      payload: {
        project_id,
        api_id: id
      }
    })
    .then(() => {
      message.success('删除成功');
      fresh();
    })
  }

  // 预览接口
  function preview (api_id: string) {
    togglePreviewModalVisible(true);
    setApiId(api_id);
  }

  // 复制接口
  function clone (api_id: string) {
    dispatch({
      type: 'project/cloneApi',
      payload: {
        project_id,
        api_id
      }
    })
    .then(() => {
      message.success('复制成功');
    });
  }

  // 导出所有接口
  function exportProject () {
    const url = exportApi({
      project_id
    });
    let ifr = document.getElementById('temp-download-iframe') as HTMLIFrameElement;;
    if (ifr) {
      ifr.src = url;
    } else {
      let iframe = document.createElement('iframe');
      iframe.src = url;
      iframe.id = 'temp-download-iframe';
      document.getElementsByTagName('head')[0].appendChild(iframe);
    }
  }

  // 提交
  function submit(e: any) {
    e.preventDefault();
    search(getFieldsValue());
  }

  return (
    <div className="wrapper">
      <Title style={{marginTop: 20}}>{meta.title}</Title>
      <Paragraph>接口前缀：<Text copyable>{`http://${window.location.hostname}:4000/mock/${meta.prefix}`}</Text></Paragraph>
      <Paragraph>项目id：{project_id}</Paragraph>
      <Form onSubmit={submit}>
        <Form.Item label="测试输入">
          {getFieldDecorator('name')(
            <Input style={{width: 200}} />
          )}
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit">提交</Button>
        </Form.Item>
      </Form>
      <div className="table-filter">
        <Button type="primary" onClick={add}>添加接口</Button>
        <Button type="primary" onClick={exportProject}>导出接口</Button>
      </div>
      <Table
        columns={columns}
        rowKey="id"
        {...tableProps}
      />
      {previewModalVisible && (
        <Preview
          project_id={project_id}
          api_id={api_id}
          onCancel={() => {togglePreviewModalVisible(false)}}
        />
      )}
    </div>
  )
}

export default Form.create()(List);