import { UploadOutlined } from '@ant-design/icons';
import { Button, DatePicker, Form, Input, Switch, Upload } from 'antd';
import React, { useState } from 'react';

const UserInfoForm = ({ onIsBrandAdminChanged, editing }) => {
  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }

    return e && e.fileList;
  };
  return (
    <>
      <Form.Item
        name="code"
        rules={[{ required: true, message: 'Code is required' }]}
      >
        <Input placeholder="Employee Code" disabled={editing} />
      </Form.Item>
      <Form.Item
        name="firstName"
        rules={[{ required: true, message: 'First Name is required' }]}
      >
        <Input placeholder="First Name" />
      </Form.Item>
      <Form.Item
        name="lastName"
        rules={[{ required: true, message: 'Last Name is required' }]}
      >
        <Input placeholder="Last Name" />
      </Form.Item>
      <Form.Item
        name="birthDate"
        rules={[{ required: true, message: 'Birthdate is required' }]}
      >
        <DatePicker style={{ width: '100%' }} placeholder="Birth Date" />
      </Form.Item>
      <Form.Item
        name="phoneNumber"
        rules={[{ required: true, message: 'Phone Number is required' }]}
      >
        <Input placeholder="Phone Number" />
      </Form.Item>
      <Form.Item
        name="email"
        rules={[{ required: true, message: 'Email is required' }]}
      >
        <Input placeholder="Email" />
      </Form.Item>
      <Form.Item
        name="address"
        rules={[{ required: true, message: 'Address is required' }]}
      >
        <Input placeholder="Address" />
      </Form.Item>
      <Form.Item
        label="Is Brand Admin"
        name="isBrandAdmin"
        valuePropName="checked"
      >
        <Switch
          onChange={(checked) => {
            onIsBrandAdminChanged(checked);
          }}
        />
      </Form.Item>
      <Form.Item
        name="photo"
        valuePropName="fileList"
        getValueFromEvent={normFile}
      >
        <Upload
          maxCount={1}
          accept="image/*"
          name="photo"
          listType="picture"
          beforeUpload={(file, fileList) => {
            return false;
          }}
        >
          <Button size="large" icon={<UploadOutlined />}>
            Choose Photo
          </Button>
        </Upload>
      </Form.Item>
    </>
  );
};

export default UserInfoForm;
