import React, { Component } from 'react';
import { Modal, Form, InputNumber, Button, message } from 'antd';
import axios from 'axios';
import showError from '../utils/ShowError';
import CompetencySelect from '../settings/competency/CompetencySelect';

const HOSPITAL_COMPETENCIES_URL = `${process.env.REACT_APP_SERVER_URL}/api/hospitalcompetencies`;

const FormItem = Form.Item;

class HospitalCompetencyWindow extends Component {
  state = {
    saving: false,
  }

  onSave = () => {
    const { hospitalCompetency, hospitalId, onSaveSuccess, form } = this.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({
        saving: true,
      }, () => {
        const hospitalCompetencyId = hospitalCompetency.id;
        const data = { ...values, hospital: hospitalId };
        const axiosObj = hospitalCompetencyId ? axios.put(`${HOSPITAL_COMPETENCIES_URL}/${hospitalCompetencyId}`, data) : axios.post(HOSPITAL_COMPETENCIES_URL, data);
        axiosObj.then(() => {
          message.success('Saving hospitalCompetency success');
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
  }

  render() {
    const { saving } = this.state;
    const { visible, onCancel, form, hospitalCompetency } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        visible={visible}
        title="Hospital Competency"
        okText="Save"
        footer={[
          <Button key="cancel" onClick={onCancel}>Cancel</Button>,
          <Button key="save" type="primary" loading={saving} onClick={this.onSave}>
            Save
          </Button>,
        ]}
      >
        <Form layout="vertical">
          <FormItem label="Competency">
            {getFieldDecorator('competency', {
              initialValue: hospitalCompetency.Competency ? String(hospitalCompetency.Competency.id) : undefined,
              rules: [
                { required: true, message: 'Please input competency' },
              ],
            })(
              <CompetencySelect level={-1} />,
            )}
          </FormItem>
          <FormItem label="Quota">
            {getFieldDecorator('quota', {
              initialValue: hospitalCompetency.quota,
              rules: [
                { required: true, message: 'Please input quota' },
              ],
            })(
              <InputNumber min={1} max={1000} />,
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(HospitalCompetencyWindow);
