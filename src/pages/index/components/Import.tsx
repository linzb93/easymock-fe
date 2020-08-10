import React, {SFC, useState} from 'react';
import {Upload, Modal, Icon, message, List, Typography, Button, Card} from 'antd';
import Cookies from 'js-cookie';
import {UploadChangeParam} from 'antd/es/upload';
import {uploadProjectUrl, fileDownload} from '@/services';
const {Dragger} = Upload;
const {Paragraph, Title} = Typography;

interface Props {
  onCancel(b?: boolean): void
};

const ImportModal:SFC<Props> = props => {
  const {onCancel} = props;
  const [error_list, setErrorList] = useState([]);
  const [tutorialVisible, toggleTutorialVisible] = useState(false);

  let msgCancelLoading: Function;

  // 文件上传前
  function beforeUpload() {
    msgCancelLoading = message.loading('正在上传', 0);
    return true;
  }
  
  // 上传文件发生变化
  function uploadChange(info: UploadChangeParam) {
    const { status, response } = info.file;
    if (status === 'done') {
      msgCancelLoading();
      if (response.code === 'SUCCESS') {
        setErrorList([]);
        message.success('文件上传成功');
        onCancel(true);
      } else {
        message.error('文件导入失败，请重新上传');
        setErrorList(response.data.errors);
      }
    } else if (status === 'error') {
      msgCancelLoading();
      message.error(`文件上传失败`);
    }
  }

  return (
    <Modal
      visible
      title="导入项目"
      footer={null}
      onCancel={() => {onCancel(false)}}
    >
      <Dragger
        accept="application/json"
        name="file"
        showUploadList={false}
        action={uploadProjectUrl}
        onChange={uploadChange}
        beforeUpload={beforeUpload}
        headers={{
          token: Cookies.get('token') || ''
        }}
      >
      <p className="ant-upload-drag-icon">
        <Icon type="inbox" />
      </p>
      <p className="ant-upload-text">点击或将文件拖拽至此上传</p>
      <p className="ant-upload-hint">仅支持上传单个.json文件，不大于2M</p>
      </Dragger>
      <Button type="link" onClick={() => {toggleTutorialVisible(true)}}>显示导入教程？</Button>
      {tutorialVisible && (
        <Card>
          <Title level={3}>导入教程</Title>
          <Paragraph>新建一个json格式的文件，字段包括项目名称 name，接口前缀 prefix，描述 description，接口列表 items，是这数组。items数组里面每一项包括：接口名称 name，地址 url，请求方式 type，返回内容 code。</Paragraph>
          <div style={{float: 'right'}}>
            <Button type="link" onClick={() => {toggleTutorialVisible(false)}}>关闭</Button>
          </div>
        </Card>
      )}
      {error_list.length ? (
        <List
          header="错误信息"
          bordered
          dataSource={error_list}
          renderItem={(item, index) => (
            <List.Item>
              <Typography.Text>{index + 1}. {item}</Typography.Text>
            </List.Item>
          )}
          style={{marginTop: 20}}
        />
      ) : null}
    </Modal>
  )
}

export default ImportModal;