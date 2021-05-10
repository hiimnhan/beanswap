import { Button, Col, Form, message, Modal, Row, Steps } from 'antd';
import moment from 'moment';
import React, { useState, useRef } from 'react';
import RuleInfo from './RuleInfo';
import RuleStore from './RuleStore';
import http from '../../configs/axios';
import { RuleActions } from '../../redux/actions/rule.actions';
import { connect } from 'react-redux';
import { getItemLocalStorage } from '../../utils/storage.utils';
import { BRAND_ID_LOCALSTORAGE } from '../../constants/service';
import Loading from '../Loading';
import { store } from '../../redux/store';
import { BrandActions } from '../../redux/actions/brand.actions';
const RuleForm = ({
  onCancel,
  visible,
  title,
  onGetRules,
  querySearch,
  onGetBalance,
  balance,
}) => {
  const [form] = Form.useForm();
  const [current, setCurrent] = useState(0);
  const [processing, setProcessing] = useState(false);
  const ruleInfo = useRef(null);

  const { walletAddress } = store.getState().brand?.currentBrand;

  const steps = [
    {
      title: 'Rule Info',
    },
    {
      title: 'Store Apply',
    },
  ];

  const stepBackHandler = () => {
    if (current > 0) {
      setCurrent(current - 1);
    }
  };
  const stepNextHandler = () => {
    form.submit();
  };

  const submitHandler = (values) => {
    switch (current) {
      case 0:
        ruleInfo.current = {
          ...values,
          startDate: moment.utc(values.date[0]).local().startOf('day'),
          endDate: moment.utc(values.date[1]).local().startOf('day'),
        };
        setCurrent(current + 1);
        break;
      case 1:
        setProcessing(true);
        onCancel();
        const brandId = getItemLocalStorage(BRAND_ID_LOCALSTORAGE);
        const rule = {
          ...ruleInfo.current,
          ...values,
          brandId,
        };
        http
          .post('/rules', rule, {
            headers: {
              brandId,
            },
          })
          .then(() => {
            message.success('add rule succesfully!');
            setProcessing(false);
            form.resetFields();
            onGetBalance(walletAddress);
            onGetRules(querySearch);
            setCurrent(0);
          })
          .catch((error) => {
            message.error(`Error: ${error.response.data?.errors[0]}`);
            setProcessing(false);
            form.resetFields();
            onCancel();
          });
        break;
      default:
        break;
    }
  };

  let stepContent = null;
  if (current === 0) {
    stepContent = <RuleInfo />;
  } else {
    stepContent = <RuleStore />;
  }
  return (
    <div>
      <Modal
        confirmLoading={processing}
        visible={visible}
        title={title}
        onCancel={onCancel}
        footer={null}
      >
        <Steps current={current}>
          {steps.map((s) => (
            <Steps.Step key={s.title} title={s.title} />
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
          <Col style={{ marginRight: 20 }}>
            <Button size="large" onClick={stepBackHandler}>
              Back
            </Button>
          </Col>
          <Col>
            <Button size="large" type="primary" onClick={stepNextHandler}>
              Next
            </Button>
          </Col>
        </Row>
      </Modal>
      {<Loading loading={processing} text={'Processing your request...'} />}
    </div>
  );
};

const mapStateToProps = (state) => ({
  balance: state.brand.balance,
});

const mapDispatchToProps = (dispatch) => ({
  onGetRules: (query) => dispatch(RuleActions.getRulesRequest(query)),
  onGetBalance: (address) => dispatch(BrandActions.getBalanceRequest(address)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RuleForm);
