import React, { Component } from 'react';
import axios from 'axios';
import { Table, Button, Input, Row, Col, Upload, message, Popconfirm, notification } from 'antd';
import showError from '../utils/ShowError';
import UserWindow from './UserWindow';
import ChangePasswordWindow from './ChangePasswordWindow';

const USERS_URL = `${process.env.REACT_APP_SERVER_URL}/api/users`;
const FILES_URL = process.env.REACT_APP_FILES_URL;
const Column = Table.Column;

const getAuthorizationHeader = () => {
  const token = window.sessionStorage.getItem('token');
  return `Bearer ${token}`;
};

const getUploadProps = (userId, afterUpload) => (
  {
    name: 'userPhotoFile',
    headers: {
      authorization: getAuthorizationHeader(),
    },
    action: `${USERS_URL}/${userId}`,
    onChange: (info) => {
      if (info.file.status !== 'uploading') {
        // console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        notification.success({
          message: 'Upload success',
          description: info.file.response,
        });
        afterUpload();
      } else if (info.file.status === 'error') {
        notification.error({
          message: 'Upload error',
          description: `${info.file.name} file upload failed.`,
        });
      }
    },
  }
);
class UserList extends Component {
  state = {
    searchText: '',
    user: {},
    users: [],
    loading: false,
    count: 0,
    currentPage: 1,
    pageSize: 10,
    userWindowVisible: false,
    changePasswordWindowVisible: false,
  }
  componentDidMount() {
    this.fetchUsers();
  }

  onSearchChange = (e) => {
    this.setState({
      searchText: e.target.value,
    });
  }

  onSaveSuccess = () => {
    this.closeEditWindow();
    this.fetchUsers();
  }

  onChangePasswordSuccess = () => {
    this.closeChangePasswordWindow();
    this.fetchUsers();
  }

  fetchUsers() {
    this.setState({
      loading: true,
    });
    axios.get(USERS_URL, { params: {
      searchText: this.state.searchText,
      currentPage: this.state.currentPage,
      pageSize: this.state.pageSize,
    } })
      .then((response) => {
        this.setState({
          users: response.data.rows,
          count: response.data.count,
          loading: false,
        });
      })
      .catch((error) => {
        showError(error);
      })
      .finally(() => {
        this.setState({
          loading: false,
        });
      });
  }

  filterUsers = () => {
    this.setState({
      currentPage: 1,
    }, () => { this.fetchUsers(); });
  }

  deleteUser(user) {
    const hide = message.loading('Action in progress..', 0);
    axios.delete(`${USERS_URL}/${user.id}`)
      .then(() => {
        message.success('Delete user success');
        this.fetchUsers();
      })
      .catch((error) => {
        showError(error);
      })
      .finally(() => {
        hide();
      });
  }

  deleteUserPhotoFile(user) {
    const hide = message.loading('Action in progress..', 0);
    axios.put(`${USERS_URL}/${user.id}/deleteuserphoto`)
      .then(() => {
        message.success('Delete file success');
        this.filterUsers();
      })
      .catch((error) => {
        showError(error);
      })
      .finally(() => {
        hide();
      });
  }

  openEditWindow = (record) => {
    this.setState({
      user: record,
      userWindowVisible: true,
    }, () => {
      this.userWindow.resetFields();
    });
  }

  closeChangePasswordWindow = () => {
    this.setState({
      changePasswordWindowVisible: false,
    });
  }

  openChangePasswordWindow = (record) => {
    this.setState({
      user: record,
      changePasswordWindowVisible: true,
    }, () => {
      this.changePasswordWindow.resetFields();
    });
  }

  closeEditWindow = () => {
    this.setState({
      userWindowVisible: false,
    });
  }

  pageChanged = (pagination) => {
    const page = pagination.current;
    this.setState({
      currentPage: page,
    }, () => { this.fetchUsers(); });
  }

  render() {
    return (
      <div>
        <Row gutter={10}>
          <Col span={8}>
            <Input
              value={this.state.searchText}
              onChange={this.onSearchChange}
              placeholder="Username or name"
              maxLength="100"
            />
          </Col>
          <Col span={16}>
            <span>
              <Button
                shape="circle"
                icon="search"
                onClick={this.filterUsers}
                style={{ marginRight: 15 }}
              />
              <Button
                type="primary"
                shape="circle"
                icon="plus"
                onClick={() => this.openEditWindow({})}
              />
            </span>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Table
              dataSource={this.state.users}
              style={{ marginTop: 20 }}
              rowKey="id"
              loading={this.state.loading}
              pagination={{
                total: this.state.count,
                current: this.state.currentPage,
                pageSize: this.state.pageSize,
              }}
              onChange={this.pageChanged}
              size="small"
            >
              <Column
                title="Username"
                dataIndex="username"
                key="username"
                render={(columnText, record) => {
                  const reg = new RegExp(this.state.searchText, 'gi');
                  const match = columnText.match(reg);
                  return (
                    <span key={record.id}>
                      {columnText.split(reg).map((text, i) => (
                        i > 0 ? [<span key={record.id} style={{ color: '#F50' }}>{match[0]}</span>, text] : text
                      ))}
                    </span>
                  );
                }}
              />
              <Column
                title="Name"
                dataIndex="name"
                key="name"
                render={(columnText, record) => {
                  const reg = new RegExp(this.state.searchText, 'gi');
                  const match = columnText.match(reg);
                  return (
                    <span key={record.id}>
                      {columnText.split(reg).map((text, i) => (
                        i > 0 ? [<span key={record.id} style={{ color: '#F50' }}>{match[0]}</span>, text] : text
                      ))}
                    </span>
                  );
                }}
              />
              <Column
                title="Role"
                dataIndex="Role.code"
              />
              <Column
                title="File"
                render={(text, record) => {
                  if (record.photo) {
                    return (
                      <div>
                        <span style={{ marginRight: 5 }}>
                          <Popconfirm
                            title={'Are you sure to remove file'}
                            onConfirm={() => this.deleteUserPhotoFile(record)}
                            okText="Yes" cancelText="No"
                          >
                            <Button
                              style={{ border: 0 }}
                              icon="close-circle"
                              shape="circle"
                              size="small"
                            />
                          </Popconfirm>
                        </span>
                        <span>
                          <a target="_blank" href={`${FILES_URL}/users/${record.id}/photos/${record.photo}.jpg`}>
                            {record.photo}
                          </a>
                        </span>
                      </div>
                    );
                  }
                  return (<div>No File</div>);
                }}
              />
              <Column
                title="Action"
                key="action"
                render={(text, record) => (
                  <span>
                    <Button
                      icon="ellipsis"
                      size="small"
                      onClick={() => this.openEditWindow(record)}
                      style={{ marginRight: 5 }}
                    />
                    <Upload {...getUploadProps(record.id, () => (this.filterUsers()))} showUploadList={false}>
                      <Button
                        icon="upload"
                        size="small"
                        style={{ marginRight: 5 }}
                      />
                    </Upload>
                    <Button
                      icon="key"
                      size="small"
                      onClick={() => this.openChangePasswordWindow(record)}
                      style={{ marginRight: 5 }}
                    />
                    <Popconfirm
                      title={`Are you sure delete user ${record.name}`}
                      onConfirm={() => this.deleteUser(record)}
                      okText="Yes" cancelText="No"
                    >
                      <Button
                        type="danger"
                        icon="delete"
                        size="small"
                      />
                    </Popconfirm>
                  </span>
                )}
              />
            </Table>
          </Col>
        </Row>

        <UserWindow
          visible={this.state.userWindowVisible}
          onSaveSuccess={this.onSaveSuccess}
          onCancel={this.closeEditWindow}
          onClose={this.closeEditWindow}
          user={this.state.user}
          ref={userWindow => (this.userWindow = userWindow)}
        />

        <ChangePasswordWindow
          visible={this.state.changePasswordWindowVisible}
          onSaveSuccess={this.onChangePasswordSuccess}
          onCancel={this.closeChangePasswordWindow}
          onClose={this.closeChangePasswordWindow}
          user={this.state.user}
          ref={changePasswordWindow => (this.changePasswordWindow = changePasswordWindow)}
        />
      </div>
    );
  }
}

export default UserList;
