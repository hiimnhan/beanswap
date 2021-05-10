import { AutoComplete, Avatar, Form, Image, Input } from 'antd';
import React, { useEffect, useState } from 'react';
import Search from '../Search';
import BeanIcon from '../../assets/images/bean-icon.png';
import { EmployeeActions } from '../../redux/actions/employee.actions';
import { connect } from 'react-redux';
import { debounce } from 'lodash';
const SendBeanForm = ({ form, onFinish, onGetEmployees, employees = {} }) => {
  const { Item } = Form;
  const [amount, setAmount] = useState(0);
  useEffect(() => {
    onGetEmployees({
      status: 1,
    });
  }, [onGetEmployees]);

  const onSearch = (val) => {
    onGetEmployees({
      name: val,
      status: 1,
    });
  };
  const onSelect = (val, option) => {
    form.setFieldsValue({
      employeeId: option.key,
    });
  };

  const onChangeAmount = (e) => {
    const { value } = e.target;
    if (!Number(value) && !Number.isInteger(value) && value.length > 0) return;
    if (value.length === 0) {
      setAmount(0);
      return;
    }
    setAmount(parseInt(value));
  };
  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Item name="employeeId" label="Select Employee">
        <Search
          placeholder="search employee by name..."
          onSearch={debounce(onSearch, 250)}
          onSelect={onSelect}
        >
          {employees?.data?.map((em) => (
            <AutoComplete.Option
              key={em.id}
              value={`${em.firstName} ${em.lastName} | ${em.phoneNumber}`}
            >
              <div style={{ display: 'flex' }}>
                <Avatar size="large" src={em.photoUrl} />
                <span
                  style={{ marginLeft: 10, marginTop: 10 }}
                >{`${em.firstName} ${em.lastName}`}</span>
              </div>
            </AutoComplete.Option>
          ))}
        </Search>
      </Item>
      <Item
        name="amount"
        label="Amount"
        rules={[
          {
            required: true,
            message: 'Need to enter beans',
          },
        ]}
        initialValue={amount}
      >
        <Input
          suffix={
            <Image src={BeanIcon} width={20} height={20} preview={false} />
          }
          style={{ width: '60%' }}
          onChange={onChangeAmount}
          value={amount}
        />
      </Item>
      <Item name="message" label="Message">
        <Input.TextArea maxLength={1000} showCount />
      </Item>
    </Form>
  );
};

const mapStateToProps = (state) => ({
  employees: state.employee.employeeList,
});

const mapDispatchToProps = (dispatch) => ({
  onGetEmployees: (query) =>
    dispatch(EmployeeActions.getEmployeesRequest(query)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SendBeanForm);
