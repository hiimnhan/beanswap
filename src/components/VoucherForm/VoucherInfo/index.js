import { UploadOutlined } from '@ant-design/icons';
import { Button, Form, Input, InputNumber, Select, Upload } from 'antd';
import React from 'react';

const VoucherInfo = () => {
  const { Item } = Form;

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }

    return e && e.fileList;
  };

  return (
    <>
      <Item
        label="Name"
        name="name"
        rules={[
          {
            required: true,
            message: 'Name is required',
          },
          {
            max: 100,
            message: 'Name should not be over 100 characters',
          },
        ]}
      >
        <Input placeholder="eg. DISCOUNT 50%" size="large" maxLength={100} />
      </Item>
      <Item
        label="Description"
        name="description"
        rules={[
          {
            required: true,
            message: 'Description is required',
          },
          {
            max: 1000,
            message: 'Description should not be over 1000 characters',
          },
        ]}
      >
        <Input.TextArea
          placeholder="eg. Get this discount at any stores"
          size="large"
          maxLength={1000}
          showCount
        />
      </Item>
      <Item
        label="Limit"
        name="limit"
        rules={[
          {
            required: true,
            message: 'Limit is required',
          },
        ]}
      >
        <InputNumber min={1} size="large" style={{ width: '50%' }} />
      </Item>
      <Item
        label="Price"
        name="price"
        rules={[{ required: true, message: 'Price is required' }]}
      >
        <InputNumber min={1} size="large" style={{ width: '50%' }} />
      </Item>
      <Item
        name="expireAfterPurchase"
        label="Expire after purchase (days)"
        rules={[
          { required: true, message: 'Need to set expire after purchase' },
        ]}
      >
        <InputNumber
          min={1}
          size="large"
          style={{ width: '50%', marginRight: 20 }}
        />
        {/* days */}
      </Item>
      <Item name="photo" valuePropName="fileList" getValueFromEvent={normFile}>
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
      </Item>
      <Item
        name="type"
        label="Type"
        rules={[
          {
            required: true,
            message: 'Select type is required',
          },
        ]}
      >
        <Select placeholder="select type" style={{ width: '50%' }}>
          <Select.Option value={0}>Discount</Select.Option>
          <Select.Option value={1}>Money</Select.Option>
          <Select.Option value={2}>Product</Select.Option>
        </Select>
      </Item>
    </>
  );
};

export default VoucherInfo;
