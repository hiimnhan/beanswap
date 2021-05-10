import { DatePicker, Form, Input, InputNumber, Select, Switch } from 'antd';
import moment from 'moment';
import React from 'react';

const RuleInfo = () => {
  const { Item } = Form;
  return (
    <>
      <Item
        name="name"
        label="Name"
        rules={[
          {
            required: true,
            message: 'Name is required',
          },
        ]}
      >
        <Input size="large" />
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
        <Input.TextArea size="large" maxLength={1000} showCount />
      </Item>
      <Item
        name="runNow"
        label="Run Now?"
        initialValue={false}
        valuePropName="checked"
      >
        <Switch defaultChecked={false} />
      </Item>
      <Item
        name="date"
        label="Date"
        rules={[
          {
            required: true,
            message: 'Need to set range of purchase date',
          },
        ]}
      >
        <DatePicker.RangePicker
          placeholder={['Start Date', 'End Date']}
          disabledDate={(current) => current.isBefore(moment())}
          size="large"
          ranges={{
            Today: [moment(), moment()],
          }}
        />
      </Item>
      <Input.Group compact>
        <Item
          name="interval"
          rules={[{ required: true, message: 'Interval is required' }]}
        >
          <InputNumber
            placeholder="Interval"
            style={{ width: 120 }}
            size="large"
            min={1}
          />
        </Item>
        <Item name="intervalType" initialValue={2}>
          <Select size="large">
            <Select.Option value={1}>One Time</Select.Option>
            <Select.Option value={2}>Day(s)</Select.Option>
            <Select.Option value={3}>Week(s)</Select.Option>
            <Select.Option value={4}>Month(s)</Select.Option>
            <Select.Option value={5}>Year(s)</Select.Option>
          </Select>
        </Item>
      </Input.Group>
    </>
  );
};

export default RuleInfo;
