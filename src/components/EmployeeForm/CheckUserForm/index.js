import { Form, Input } from 'antd';
import React from 'react';

const CheckUserForm = () => {
  return (
    <>
      <Form.Item name="phoneNumber">
        <Input placeholder="Phone Number" />
      </Form.Item>
      <Form.Item name="email">
        <Input placeholder="Email" />
      </Form.Item>
    </>
  );
};

export default CheckUserForm;
