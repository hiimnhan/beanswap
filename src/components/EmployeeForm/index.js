import { Button, Col, Form, Modal, Row, Steps } from 'antd';
import React, { useCallback, useRef, useState } from 'react';
import { connect } from 'react-redux';

import UserInfoForm from './UserInfoForm';

import UserPositionForm from './UserPositionForm';
import { EmployeeActions } from '../../redux/actions/employee.actions';
import Loading from '../Loading';
import { getItemLocalStorage } from '../../utils/storage.utils';
import { BRAND_ID_LOCALSTORAGE } from '../../constants/service';

const { Step } = Steps;

const EmployeeForm = ({
  visible,
  title,

  onCancel,
  success,

  onAddEmployee,
}) => {
  const [form] = Form.useForm();
  const [current, setCurrent] = useState(0);
  const [isOptionalStep, setIsOptionalStep] = useState(false);
  const [clearStores, setClearStores] = useState(false);
  const userInfo = useRef(null);

  const stepBackHandler = () => {
    if (current > 0) {
      setCurrent(current - 1);
    }
  };

  const steps = [
    {
      title: 'User Info',
    },
    {
      title: 'User Position',
    },
  ];

  const stepNextHandler = () => {
    form.submit();
  };

  const submitHandler = (values) => {
    switch (current) {
      case 0:
        userInfo.current = values;
        setCurrent(current + 1);
        break;
      case 1:
        const newEmployee = {
          ...userInfo.current,
          ...values,
        };
        createEmployee(newEmployee);
        form.resetFields();
        setCurrent(0);
        onCancel();

        break;
      default:
        break;
    }
  };

  const createEmployee = useCallback(
    (newEmployee) => {
      const brandId = getItemLocalStorage(BRAND_ID_LOCALSTORAGE);

      const formData = new FormData();

      formData.append('code', newEmployee.code);
      formData.append('firstName', newEmployee.firstName);
      formData.append('lastName', newEmployee.lastName);
      formData.append('birthDate', newEmployee.birthDate.toISOString());
      formData.append('address', newEmployee.address);
      formData.append('region', 'VN');
      formData.append('phoneNumber', newEmployee.phoneNumber);
      formData.append('email', newEmployee.email);
      formData.append('photo', newEmployee.photo[0].originFileObj);
      formData.append('isBrandAdmin', !!newEmployee.isBrandAdmin);
      formData.append('brandId', brandId);
      if (newEmployee?.stores && newEmployee.stores.length > 0) {
        newEmployee.stores.forEach((store, index) => {
          formData.append(`stores[${index}].storeId`, store.storeId);
          formData.append(`stores[${index}].isManager`, store.isManager);
        });
      }

      onAddEmployee(formData);
      setClearStores(true);
    },
    [onAddEmployee]
  );
  let stepContent = null;

  if (current === 0) {
    stepContent = (
      <UserInfoForm
        onIsBrandAdminChanged={(checked) => {
          setIsOptionalStep(checked);
        }}
      />
    );
  } else {
    stepContent = (
      <UserPositionForm optional={isOptionalStep} clearStores={clearStores} />
    );
  }

  return (
    <div>
      <Modal visible={visible} title={title} onCancel={onCancel} footer={null}>
        <Steps current={current}>
          {steps.map((s) => (
            <Step key={s.title} title={s.title} />
          ))}
        </Steps>

        <Form
          style={{ margin: '16px 0' }}
          layout="vertical"
          form={form}
          onFinish={submitHandler}
        >
          {stepContent}
        </Form>
        <Row justify="end" align="middle">
          <Col>
            {current !== 0 && <Button onClick={stepBackHandler}>Back</Button>}
          </Col>
          <Col>
            <Button
              style={{ marginLeft: 20 }}
              type="primary"
              onClick={stepNextHandler}
            >
              {isOptionalStep && current === steps.length - 1
                ? 'Skip & Next'
                : 'Next'}
            </Button>
          </Col>
        </Row>
      </Modal>
      {<Loading loading={success} text={'Processing your request...'} />}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    userId: state.employee.employeeInfo.user.id,
    success: state.employee.success,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onAddEmployee: (data) => dispatch(EmployeeActions.addEmployeeRequest(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EmployeeForm);
