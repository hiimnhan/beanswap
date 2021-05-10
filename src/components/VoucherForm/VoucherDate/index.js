import { DatePicker, Form } from 'antd';
import React from 'react';
import moment from 'moment';
const VoucherDate = ({ form }) => {
  const { Item } = Form;
  const { RangePicker } = DatePicker;
  return (
    <>
      <Item
        name="purchaseDate"
        label="Purchase Date Range"
        rules={[
          { required: true, message: 'Need to set range of purchase date' },
        ]}
      >
        <RangePicker
          ranges={{
            Today: [moment(), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
          }}
          placeholder={['Start Purchase', 'End Purchase']}
          disabledDate={(current) => {
            return current.isBefore(moment().subtract(1, 'days'));
          }}
        />
      </Item>
      <Item
        name="redeemDate"
        label="Redeem Date Range"
        rules={[
          { required: true, message: 'Need to set range of redeem date' },
        ]}
      >
        <RangePicker
          ranges={{
            Today: [moment(), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
          }}
          placeholder={['Start Redeem', 'End Redeem']}
          disabledDate={(current) => {
            const purchaseDate = form.getFieldValue('purchaseDate');
            return current.isBefore(moment(purchaseDate[0]));
          }}
        />
      </Item>
    </>
  );
};

export default VoucherDate;
