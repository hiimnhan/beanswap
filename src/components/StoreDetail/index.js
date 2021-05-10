import { CopyOutlined, UserAddOutlined } from '@ant-design/icons';
import { Avatar, Form, Input, message, Modal, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { StoreActions } from '../../redux/actions/store.actions';
import EmployeeToStore from '../EmployeeToStore';

import './styles.css';

const INITIAL_ADD_EMPLOYEE = {
  visible: false,
  existedEmployees: [],
};

const StoreDetail = ({
  item,
  visible,
  title,
  onCancel,
  onAddEmpToStore,
  addLoading,
}) => {
  const [form] = Form.useForm();
  const [showAddEmployee, setShowAddEmployee] = useState(INITIAL_ADD_EMPLOYEE);

  const copyToClipboard = (walletAddress) => {
    navigator.clipboard.writeText(walletAddress);
    message.success('copied address to clipboard');
  };

  useEffect(() => {
    if (item) {
      form.setFieldsValue({
        code: item.code,
        name: item.name,
        address: item.address,
        walletAddress: item.walletAddress,
      });
    }
  }, [item, form]);

  const startAddEmployee = () => {
    const existedEmp = item.employees.map((em) => em.employee.id);
    setShowAddEmployee((prev) => ({
      ...prev,
      visible: true,
      existedEmployees: existedEmp,
    }));
  };

  const handleAddEmployee = (values) => {
    console.log(values);
    const payload = {
      ...values,
      storeId: item.id,
    };
    onAddEmpToStore(payload);
  };

  useEffect(() => {
    if (!addLoading) {
      setShowAddEmployee(INITIAL_ADD_EMPLOYEE);
    }
  }, [addLoading]);

  return (
    <Modal
      visible={visible}
      title={title}
      footer={null}
      onCancel={onCancel}
      width={800}
    >
      <div className="flex-container">
        <div className="avatar">
          <Avatar
            style={{ marginBottom: 20 }}
            src={item?.photoUrl}
            size={150}
            shape="square"
          />
          <div className="store-list">
            <div style={{ fontWeight: 'bold' }}>
              <span style={{ marginRight: 30 }}>EmployeeList</span>
              <UserAddOutlined
                style={{
                  cursor: 'pointer',
                  color: '#f2911b',
                  fontSize: '1rem',
                }}
                onClick={() => startAddEmployee()}
              />
            </div>
            {item?.employees.map((e) => (
              <div key={e.id} className="store-employee">
                <span>{`${e.employee.firstName} ${e.employee.lastName}`}</span>
                <div>{e?.isManager && <Tag color="warning">Manager</Tag>}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="info">
          <Form
            layout="vertical"
            form={form}
            style={{ marginTop: 30, marginLeft: 20 }}
          >
            <Form.Item
              name="code"
              initialValue={item?.code}
              label="Code"
              style={{ marginRight: 20 }}
            >
              <Input
                style={{ borderBottom: '2px solid #334d6e' }}
                className="detail-input"
                bordered={false}
              />
            </Form.Item>
            <Form.Item
              name="name"
              initialValue={item?.name}
              label="Name"
              style={{ marginRight: 20 }}
            >
              <Input
                style={{ borderBottom: '2px solid #334d6e' }}
                className="detail-input"
                bordered={false}
              />
            </Form.Item>

            <Form.Item
              name="address"
              initialValue={item?.address}
              label="Address"
            >
              <Input
                style={{ borderBottom: '2px solid #334d6e' }}
                className="detail-input"
                bordered={false}
              />
            </Form.Item>

            <Form.Item
              name="walletAddress"
              initialValue={item?.walletAddress}
              label="Wallet Address"
            >
              <Input
                style={{ borderBottom: '2px solid #334d6e' }}
                className="detail-input"
                bordered={false}
                suffix={
                  <CopyOutlined
                    onClick={() => copyToClipboard(item?.walletAddress)}
                  />
                }
              />
            </Form.Item>
          </Form>
        </div>
      </div>
      <EmployeeToStore
        visible={showAddEmployee.visible}
        existedEmployees={showAddEmployee.existedEmployees}
        onFinish={handleAddEmployee}
        onCancel={() => setShowAddEmployee(INITIAL_ADD_EMPLOYEE)}
      />
    </Modal>
  );
};

const mapStateToProps = (state) => ({
  addLoading: state.store.addLoading,
});

const mapDispatchToProps = (dispatch) => ({
  onAddEmpToStore: (payload) =>
    dispatch(StoreActions.addEmployeeToStoreRequest(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(StoreDetail);
