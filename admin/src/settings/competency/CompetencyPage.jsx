import React from 'react';
import { Layout } from 'antd';
import CompetencyList from './CompetencyList';

const { Header, Content } = Layout;

export default () => (
  <Layout style={{ height: '100%' }}>
    <Header className="page-header">
      <span>Settings &gt;</span><span className="page-header-title"> Competencies</span>
    </Header>
    <Content className="page-content">
      <CompetencyList />
    </Content>
  </Layout>
);
