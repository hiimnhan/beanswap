import { Button, DatePicker, Form, Select, Tag } from 'antd';

import React, { useEffect } from 'react';

const RuleFilter = ({ onFinish, resetFields }) => {
  const [form] = Form.useForm();
  const { Item } = Form;
  const { RangePicker } = DatePicker;
  useEffect(() => {
    if (resetFields) {
      form.resetFields();
    }
  }, [resetFields, form]);
  return (
    <Form layout="inline" form={form} onFinish={onFinish}>
      <Item name="dateRange">
        <RangePicker placeholder={['Start Date', 'End Date']} />
      </Item>
      <Item name="intervalType">
        <Select placeholder="Interval Type" style={{ width: 150 }}>
          <Select.Option value={1}>
            <Tag color="default">One Time</Tag>
          </Select.Option>
          <Select.Option value={2}>
            <Tag color="orange">Days</Tag>
          </Select.Option>
          <Select.Option value={3}>
            <Tag color="pink">Weeks</Tag>
          </Select.Option>
          <Select.Option value={4}>
            <Tag color="blue">Months</Tag>
          </Select.Option>
          <Select.Option value={5}>
            <Tag color="green">Years</Tag>
          </Select.Option>
        </Select>
      </Item>
      <Item name="status">
        <Select placeholder="Status" style={{ width: 120 }}>
          <Select.Option value={0}>
            <Tag color="error">Disabled</Tag>
          </Select.Option>
          <Select.Option value={1}>
            <Tag color="warning">Active</Tag>
          </Select.Option>
          <Select.Option value={2}>
            <Tag color="success">Finished</Tag>
          </Select.Option>
        </Select>
      </Item>
      <Button type="primary" htmlType="submit">
        Search
      </Button>
    </Form>
  );
};

export default RuleFilter;
