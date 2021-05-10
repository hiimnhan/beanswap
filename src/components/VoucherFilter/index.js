import { Form, DatePicker, Select, Button, Tag } from 'antd';
import React, { useEffect } from 'react';
import moment from 'moment';
const VoucherFilter = ({ onFinish, resetField }) => {
  const { Item } = Form;
  const { RangePicker } = DatePicker;
  const [form] = Form.useForm();
  useEffect(() => {
    if (resetField) {
      form.resetFields();
    }
  }, [resetField, form]);
  return (
    <Form layout="inline" form={form} onFinish={onFinish}>
      <Item name="purchaseDateRange">
        <RangePicker
          ranges={{
            Today: [moment(), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
          }}
          placeholder={['Start Purchase', 'End Purchase']}
        />
      </Item>
      <Item name="redeemDateRannge">
        <RangePicker
          ranges={{
            Today: [moment(), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
          }}
          placeholder={['Start Redeem', 'End Redeem']}
        />
      </Item>
      <Item name="type">
        <Select placeholder="Type" style={{ width: 120 }}>
          <Select.Option value={0}>Discount</Select.Option>
          <Select.Option value={1}>Money</Select.Option>
          <Select.Option value={2}>Product</Select.Option>
        </Select>
      </Item>
      <Item name="status">
        <Select placeholder="Status" style={{ width: 120 }}>
          <Select.Option value={1}>
            <Tag color="success">Active</Tag>
          </Select.Option>
          <Select.Option value={0}>
            <Tag color="error">Inactive</Tag>
          </Select.Option>
        </Select>
      </Item>
      <Button type="primary" htmlType="submit">
        Search
      </Button>
    </Form>
  );
};

export default VoucherFilter;
