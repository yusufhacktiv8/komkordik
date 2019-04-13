import React, { Component } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import axios from 'axios';
import showError from '../../utils/ShowError';
import DepartmentSelect from '../../settings/department/DepartmentSelect';

const COMPETENCIES_URL = `${process.env.REACT_APP_SERVER_URL}/api/competencies`;

const FormItem = Form.Item;

class CompetencyWindow extends Component {
  state = {
    saving: false,
  };

  onSave = () => {
    const { competency, onSaveSuccess, form } = this.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({
        saving: true,
      }, () => {
        const competencyId = competency.id;
        const axiosObj = competencyId ? axios.put(`${COMPETENCIES_URL}/${competencyId}`, values) : axios.post(COMPETENCIES_URL, values);
        axiosObj.then(() => {
          message.success('Saving competency success');
          this.setState({
            saving: false,
          }, () => {
            onSaveSuccess();
          });
        })
          .catch((error) => {
            this.setState({
              saving: false,
            });
            showError(error);
          });
      });
    });
  };

  render() {
    const { saving } = this.state;
    const { visible, onCancel, form, competency } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        visible={visible}
        title="Competency"
        okText="Save"
        footer={[
          <Button key="cancel" onClick={onCancel}>Cancel</Button>,
          <Button key="save" type="primary" loading={saving} onClick={this.onSave}>
            Save
          </Button>,
        ]}
      >
        <Form layout="vertical">
          <FormItem label="Code">
            {getFieldDecorator('code', {
              initialValue: competency.code,
              rules: [
                { required: true, message: 'Please input code' },
              ],
            })(
              <Input maxLength="30" />,
            )}
          </FormItem>
          <FormItem label="Name">
            {getFieldDecorator('name', {
              initialValue: competency.name,
              rules: [
                { required: true, message: 'Please input name' },
              ],
            })(
              <Input maxLength="50" />,
            )}
          </FormItem>
          <FormItem label="Department">
            {getFieldDecorator('department', {
              initialValue: competency.Department ? String(competency.Department.id) : undefined,
              rules: [
                { required: true, message: 'Please input department' },
              ],
            })(
              <DepartmentSelect level={-1} />,
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(CompetencyWindow);
