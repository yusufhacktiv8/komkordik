import React, { Component } from 'react';
import axios from 'axios';
import { Table, Button, Row, Col, Tag, Icon, Spin, message, Popconfirm } from 'antd';
import showError from '../utils/ShowError';
import HospitalCompetencyWindow from './HospitalCompetencyWindow';

const HOSPITALS_URL = `${process.env.REACT_APP_SERVER_URL}/api/hospitals`;
const HOSPITAL_COMPETENCIES_URL = `${process.env.REACT_APP_SERVER_URL}/api/hospitalcompetencies`;
const getHospitalCompetencyUrl = hospitalId => `${HOSPITALS_URL}/${hospitalId}/competencies`;
const Column = Table.Column;

class HospitalCompetencyList extends Component {
  state = {
    searchText: '',
    hospital: {},
    hospitalCompetency: {},
    hospitalCompetencies: [],
    loading: false,
    hospitalCompetencyWindowVisible: false,
  }
  componentDidMount() {
    this.fetchHospitalCompetencies();
    this.fetchHospital();
  }

  onSearchChange = (e) => {
    this.setState({
      searchText: e.target.value,
    });
  }

  onSaveSuccess = () => {
    this.closeEditWindow();
    this.fetchHospitalCompetencies();
  }

  fetchHospitalCompetencies() {
    const { match } = this.props;
    const { hospitalId } = match.params;
    this.setState({
      loading: true,
    });
    axios.get(getHospitalCompetencyUrl(hospitalId), { params: {
      searchText: this.state.searchText,
      start: (this.state.currentPage - 1) * this.state.pageSize,
      count: this.state.pageSize,
    } })
      .then((response) => {
        this.setState({
          hospitalCompetencies: response.data,
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

  fetchHospital() {
    const { match } = this.props;
    const { hospitalId } = match.params;
    this.setState({
      loading: true,
    });
    axios.get(`${HOSPITALS_URL}/${hospitalId}`, { params: {} })
      .then((response) => {
        this.setState({
          hospital: response.data,
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

  filterHospitalCompetencies = () => {
    this.setState({
      currentPage: 1,
    }, () => { this.fetchHospitalCompetencies(); });
  }

  deleteHospitalCompetency(hospitalCompetency) {
    const hide = message.loading('Action in progress..', 0);
    axios.delete(`${HOSPITAL_COMPETENCIES_URL}/${hospitalCompetency.id}`)
      .then(() => {
        message.success('Delete hospitalCompetency success');
        this.fetchHospitalCompetencies();
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
      hospitalCompetency: record,
      hospitalCompetencyWindowVisible: true,
    }, () => {
      this.hospitalCompetencyWindow.resetFields();
    });
  }

  closeEditWindow = () => {
    this.setState({
      hospitalCompetencyWindowVisible: false,
    });
  }

  render() {
    const { match } = this.props;
    const { hospitalId } = match.params;
    const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
    return (
      <div>
        <Col span={8}>
          {
            this.state.hospital.code ? (
              <span>
                <Tag style={{ height: 26, fontSize: 15 }} color="#2db7f5">{ this.state.hospital.name}</Tag>
                <Tag style={{ height: 26, fontSize: 15 }}>{ this.state.hospital.code}</Tag>
              </span>
            ) : (
              <Spin indicator={antIcon} />
            )
          }
        </Col>
        <Row gutter={10}>
          <Col span={8}>
            <span>
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
              dataSource={this.state.hospitalCompetencies}
              style={{ marginTop: 20 }}
              rowKey="id"
              loading={this.state.loading}
              size="small"
            >
              <Column
                title="Name"
                dataIndex="Competency.name"
              />
              <Column
                title="Quota"
                dataIndex="quota"
                key="quota"
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
                    <Popconfirm
                      title={`Are you sure delete hospital competency ${record.Competency.name}`}
                      onConfirm={() => this.deleteHospitalCompetency(record)}
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

        <HospitalCompetencyWindow
          visible={this.state.hospitalCompetencyWindowVisible}
          onSaveSuccess={this.onSaveSuccess}
          onCancel={this.closeEditWindow}
          onClose={this.closeEditWindow}
          hospitalCompetency={this.state.hospitalCompetency}
          hospitalId={hospitalId}
          ref={hospitalCompetencyWindow => (this.hospitalCompetencyWindow = hospitalCompetencyWindow)}
        />
      </div>
    );
  }
}

export default HospitalCompetencyList;
