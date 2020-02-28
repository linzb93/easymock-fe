import React, {PureComponent} from 'react';
import {Table, Button, message} from 'antd';
import { connect } from 'dva';
import CreateModal from './components/Create';
import ImportModal from './components/Import';
import {Link} from 'react-router-dom';
import {AnyObject} from '@/utils/interface';

interface Props extends AnyObject {
};

class Index extends PureComponent<Props> {
  constructor(props: any) {
    super(props);
  }
  
  public readonly state = {
    data: [],
    createModalVisible: false,
    importModalVisible: false,
    project_id: ''
  };
  
  private columns = [
    {
      title: '名称',
      dataIndex: 'title',
      render: (text: string, record: AnyObject) => (
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
      render: (text: string, record: AnyObject) => (
        <div className="table-opr-wrap">
          <Button type="primary" size="small" onClick={() => {this.edit(record.project_id)}}>编辑</Button>
          <Button type="danger" size="small" onClick={() => {this.delete(record.project_id)}}>删除</Button>
        </div>
      )
    }
  ];

  componentDidMount() {
    this.getProjectList();
  }

  // 获取项目列表
  getProjectList = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'index/getProjectList'
    })
    .then((res: any) => {
      this.setState({
        data: res.data
      });
    });
  }
      
  // 编辑
  edit = (id : string) => {
    this.setState({
      createModalVisible: true,
      project_id: id
    });
  }
  
  // 删除
  delete = (id : string) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'index/deleteProject',
      payload: {
        project_id: id
      }
    })
    .then(() => {
      message.success('删除成功');
      this.getProjectList();
    });
  }
  
  // 添加
  add = () => {
    this.setState({
      createModalVisible: true
    });
  }
  
  // 导入项目
  import = () => {
    this.setState({
      importModalVisible: true
    });
  }

  // 关闭弹窗
  cancelModal = (name: string, reloaded?: boolean) => {
    this.setState({
      [name]: false
    });
    if (reloaded) {
      this.getProjectList();
    }
  }
      
  render() {
    const {data, createModalVisible, importModalVisible, project_id} = this.state;
    return (
      <div className="wrapper">
      <div className="table-filter">
        <Button type="primary" onClick={this.add}>添加项目</Button>
        <Button type="primary" onClick={this.import}>导入项目</Button>
      </div>
      <Table
        columns={this.columns}
        dataSource={data}
        pagination={false}
        rowKey="project_id"
        bordered
      />
      {createModalVisible && (
        <CreateModal
          onCancel={(reloaded: boolean) => {this.cancelModal('createModalVisible', reloaded)}}
          project_id={project_id}
        />
      )}
      {importModalVisible && (
        <ImportModal
          onCancel={(reloaded: boolean) => {this.cancelModal('importModalVisible', reloaded)}}
        />
      )}
    </div>
    )
  }
}

export default connect()(Index);