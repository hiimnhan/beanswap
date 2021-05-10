import { CopyOutlined } from '@ant-design/icons';
import { Avatar, Form, Input, message, Modal, Tag } from 'antd';
import moment from 'moment';
import React from 'react';
import { useEffect } from 'react';

import './styles.css';

const EmployeeDetails = ({ item, visible, title, onCancel }) => {
  const [form] = Form.useForm();
  const copyToClipboard = (walletAddress) => {
    navigator.clipboard.writeText(walletAddress);
    message.success('copied address to clipboard');
  };

  useEffect(() => {
    if (item) {
      form.setFieldsValue({
        firstName: item.firstName,
        lastName: item.lastName,
        address: item.address,
        birthdate: moment(item?.birthDate).format('DD/MM/yyyy'),
        phoneNumber: item.phoneNumber,
        email: item.email,
        walletAddress: item.walletAddress,
      });
    }
  }, [item, form]);
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
          />
          {item?.isBrandAdmin && <Tag color="success">Brand Admin</Tag>}
          <div className="store-list">
            <div style={{ fontWeight: 'bold' }}>Store List</div>
            {item?.stores
              .filter((st) => st.status !== 0)
              .map((s) => (
                <div key={s.id} className="store-employee">
                  <span>{s?.store?.name}</span>
                  <div>
                    {s?.isManager && <Tag color="warning">Manager</Tag>}
                  </div>
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
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <Form.Item
                name="firstName"
                initialValue={item?.firstName}
                label="First Name"
                style={{ marginRight: 20 }}
              >
                <Input
                  style={{ borderBottom: '2px solid #334d6e' }}
                  className="detail-input"
                  bordered={false}
                />
              </Form.Item>
              <Form.Item
                name="lastName"
                initialValue={item?.lastName}
                label="Last Name"
              >
                <Input
                  style={{ borderBottom: '2px solid #334d6e' }}
                  className="detail-input"
                  bordered={false}
                />
              </Form.Item>
            </div>
            <Form.Item
              name="birthdate"
              initialValue={moment(item?.birthDate).format('DD/MM/yyyy')}
              label="Date of birth"
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
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <Form.Item
                name="phoneNumber"
                initialValue={item?.phoneNumber}
                label="Phone Number"
                style={{ marginRight: 20 }}
              >
                <Input
                  style={{ borderBottom: '2px solid #334d6e' }}
                  className="detail-input"
                  bordered={false}
                />
              </Form.Item>
              <Form.Item name="email" initialValue={item?.email} label="Email">
                <Input
                  style={{ borderBottom: '2px solid #334d6e' }}
                  className="detail-input"
                  bordered={false}
                />
              </Form.Item>
            </div>
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
    </Modal>
  );
};

export default EmployeeDetails;
