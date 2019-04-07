import React, { Component } from 'react';
import { Select } from 'antd';
import axios from 'axios';
import showError from '../../utils/ShowError';

const Option = Select.Option;
const COMPETENCIES_URL = `${process.env.REACT_APP_SERVER_URL}/api/competencies`;

class CompetencySelect extends Component {
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
        this.setState({
          competencies: response.data.rows,
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
      <Select
        placeholder="Select Competency"
        onChange={this.handleChange}
        value={this.state.value}
      >
        {this.state.competencies.map(competency => (
          <Option key={competency.id} value={competency.id}>{competency.name}</Option>
        ))}
      </Select>
    );
  }
}

export default CompetencySelect;
