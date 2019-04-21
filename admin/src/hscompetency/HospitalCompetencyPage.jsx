import React, { Component } from 'react';
import { Layout } from 'antd';
import HospitalCompetencyList from './HospitalCompetencyList';

const { Header, Content } = Layout;

export default class HospitalCompetencyPage extends Component {
  goToHospitalPage = () => {
    this.props.history.push('/hospitals');
  }

  render() {
    const { match } = this.props;
    return (
      <Layout style={{ height: '100%' }}>
        <Header className="page-header">
          <span role="link" onClick={this.goToHospitalPage}>Hospitals &gt;</span><span className="page-header-title"> Competencies</span>
        </Header>
        <Content className="page-content">
          <HospitalCompetencyList match={match} />
        </Content>
      </Layout>
    );
  }
}
