import React, { Component } from 'react';
import { Cascader } from 'antd';
import _ from 'lodash';
import axios from 'axios';
import showError from '../../utils/ShowError';

const COMPETENCIES_URL = `${process.env.REACT_APP_SERVER_URL}/api/allcompetencies`;

class CompetencyCascader extends Component {
  constructor(props) {
    super(props);

    const value = this.props.value;
    this.state = {
      value,
      competencies: [],
    };
  }

  componentDidMount() {
    this.fetchCompetencies();
  }

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      const value = nextProps.value;
      this.setState({ value });
    }
  }

  fetchCompetencies() {
    axios.get(COMPETENCIES_URL, { params: {
      searchText: '',
      start: 0,
      count: 100,
    } })
      .then((response) => {
        const rows = response.data;
        const grouped = _.groupBy(rows, 'DepartmentId');
        console.log(grouped);
        const competencies = _.map(grouped, ((value, key) => {
          return {
            value: key,
            label: value[0].Department.name,
            children: value.map((val) => {
              return {
                value: val.id,
                label: val.name,
              };
            }),
          };
        }));
        this.setState({
          competencies,
        });
      })
      .catch((error) => {
        showError(error);
      });
  }

  handleChange = (value) => {
    if (!('value' in this.props)) {
      this.setState({ value });
    }
    this.triggerChange(value);
  }

  triggerChange = (changedValue) => {
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(changedValue);
    }
  }

  render() {
    return (
      <Cascader
        placeholder="Select Competency"
        onChange={this.handleChange}
        value={this.state.value}
        options={this.state.competencies}
      />
    );
  }
}

export default CompetencyCascader;
