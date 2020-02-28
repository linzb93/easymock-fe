import React, {PureComponent} from 'react';
import {Table, Button, message, Typography, Tag} from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import copy from 'copy-to-clipboard';
import Preview from './components/Preview';
import {AnyObject} from '@/utils/interface';
import {exportApi} from '@/services/project';

const {Text, Paragraph, Title} = Typography;

function TypeTag({type}:{type:string}) {
   const typeMap: AnyObject= {
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
interface State {
  meta: AnyObject,
  data: AnyObject,
  pagination: AnyObject,
  previewModalVisible: boolean,
  project_id: string,
  api_id: string,
  fetch_type: string
}

class List extends PureComponent<Props, State> {
  constructor(props: any) {
    super(props);
  }
  state = {
    meta: {},
    data: {
      list:[],
      total: 0
    },
    pagination: {
      size: 10,
      current: 1
    },
    previewModalVisible: false,
    project_id: '',
    api_id: '',
    fetch_type: ''
  }
  columns = [
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
          <Button type="primary" size="small" onClick={() => {this.edit(record.id)}}>编辑</Button>
          <Button type="primary" size="small" onClick={() => {this.preview(record.id, record.type)}}>预览</Button>
          <Button type="primary" size="small" onClick={() => {this.clone(record.id)}}>克隆</Button>
          <Button type="primary" size="small" onClick={() => {this.copyToClipboard(record.url)}}>复制接口地址</Button>
          <Button type="danger" size="small" onClick={() => {this.delete(record.id)}}>删除</Button>
        </div>
      )
    }
  ]

  componentDidMount() {
    const {dispatch, match} = this.props;
    const {project_id} = match.params
    dispatch({
      type: 'index/getProjectDetail',
      payload: {
        project_id
      }
    })
    .then((res: AnyObject) => {
      this.setState({
        project_id,
        meta: {
          ...res.data,
          prefix: `${project_id}${res.data.prefix}`
        }
      }, () => {
        this.fetchList();
      })
    });
  }

  // 获取接口分页
  fetchList = () => {
    const {dispatch} = this.props;
    const {project_id, pagination: {current, size}} = this.state;
    dispatch({
      type: 'project/getApiPage',
      payload: {
        project_id,
        page: current,
        size
      }
    })
    .then((res: AnyObject) => {
      this.setState({
        data: res.data
      })
    })
  }

  // 触发分页事件
  changePaginationCurrent = (current: number) => {
    this.setState((prevState: State) => ({
      pagination: {
        ...prevState.pagination,
        current
      }
    }), () => {
      this.fetchList();
    });
  }

  // 复制项目地址
  copyToClipboard = (url: string) => {
    const {meta}: {meta: AnyObject} = this.state;
    copy(`${window.location.hostname}:4000/mock/${meta.prefix}${url}`);
    message.success('接口复制成功');
    
  }

  // 添加接口
  add = () => {
    const {project_id} = this.state;
    console.log(`/project/${project_id}/create`);
    router.push(`/project/${project_id}/create`);
  };

  // 编辑接口
  edit = (id: string) => {
    const {project_id} = this.state;
    router.push(`/project/${project_id}/update/${id}`);
  }

  // 删除接口
  delete = (id: string) => {
    const {dispatch} = this.props;
    const {project_id} = this.state;
    dispatch({
      type: 'project/deleteApi',
      payload: {
        project_id,
        api_id: id
      }
    })
    .then(() => {
      message.success('删除成功');
      this.fetchList();
    })
  }

  // 预览接口
  preview = (api_id: string, type: string) => {
    this.setState({
      previewModalVisible: true,
      api_id,
      fetch_type: type
    })
  }

  // 复制接口
  clone = (api_id: string) => {
    const {dispatch} = this.props;
    const {project_id} = this.state;
    
    dispatch({
      type: 'project/cloneApi',
      payload: {
        project_id,
        api_id
      }
    })
    .then(() => {
      message.success('复制成功');
      this.fetchList();
    });
  }

  // 导出所有接口
  export = () => {
    const {project_id} = this.state;
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
  
  render() {
    const {
      data,
      previewModalVisible,
      project_id,
      api_id,
      fetch_type,
      meta,
      pagination
    }: {meta: AnyObject, [p:string]: any} = this.state;
    return (
      <div className="wrapper">
        <Title style={{marginTop: 20}}>{meta.title}</Title>
        <Paragraph>接口前缀：<Text copyable>{`http://${window.location.hostname}:4000/mock/${meta.prefix}`}</Text></Paragraph>
        <Paragraph>项目id：{project_id}</Paragraph>
        <div className="table-filter">
          <Button type="primary" onClick={this.add}>添加接口</Button>
          <Button type="primary" onClick={this.export}>导出接口</Button>
        </div>
        <Table
          dataSource={data.list}
          columns={this.columns}
          rowKey="id"
          pagination={{
            total: data.total,
            showTotal: total => `共有 ${total} 条记录`,
            pageSize: pagination.size,
            onChange: this.changePaginationCurrent,
            current: pagination.current,
            defaultCurrent: pagination.current,
          }}
          bordered
        />
        {previewModalVisible && (
          <Preview
            project_id={project_id}
            api_id={api_id}
            type={fetch_type}
            onCancel={() => {this.setState({previewModalVisible: false})}}
          />
        )}
      </div>
    )
  }
}

export default connect()(List);