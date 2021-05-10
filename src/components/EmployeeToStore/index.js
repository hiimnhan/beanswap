import { PlusCircleOutlined } from '@ant-design/icons';
import { Form, Modal, Select, Switch } from 'antd';
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { EmployeeActions } from '../../redux/actions/employee.actions';

const EmployeeToStore = ({
  existedEmployees = [],
  onGetEmployees,
  employees = {},
  loading,
  visible,
  onCancel,
  onFinish,
  modalLoading = false,
}) => {
  const [employeeSearchList, setEmployeeSearchList] = useState([]);
  const [form] = Form.useForm();
  useEffect(() => {
    onGetEmployees({
      fields: 'stores',
    });
  }, [onGetEmployees]);

  useEffect(() => {
    const filterEmployees = () => {
      if (employees) {
        const filterEmployee = employees?.data?.filter(
          (e) => !existedEmployees.includes(e.id)
        );
        setEmployeeSearchList(filterEmployee);
      }
    };
    filterEmployees();
  }, [existedEmployees, employees]);
  return (
    <Modal
      okText="Add"
      kButtonProps={{
        icon: <PlusCircleOutlined />,
      }}
      confirmLoading={modalLoading}
      visible={visible}
      title="Add Employee To Store"
      onCancel={onCancel}
      onOk={() => form.submit()}
    >
      <Form form={form} onFinish={onFinish}>
        <Form.Item label="Employee" name="employeeId">
          <Select placeholder="Select a employee">
            {employeeSearchList?.map((em) => (
              <Select.Option
                key={em.id}
              >{`${em.firstName} ${em.lastName}`}</Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Manager" name="isManager" valuePropName="checked">
          <Switch checkedChildren="Manager" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

const mapStateToProps = (state) => ({
  employees: state.employee.employeeList,
  loading: state.employee.loading,
});

const mapDispatchToProps = (dispatch) => ({
  onGetEmployees: (query) =>
    dispatch(EmployeeActions.getEmployeesRequest(query)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EmployeeToStore);
