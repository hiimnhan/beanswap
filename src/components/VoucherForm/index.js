import { Button, Col, Form, Modal, Row, Steps } from 'antd';
import moment from 'moment';
import React, { useState, useRef } from 'react';
import VoucherDate from './VoucherDate';
import VoucherInfo from './VoucherInfo';
import { VoucherActions } from '../../redux/actions/voucher.actions';
import { connect } from 'react-redux';
import Loading from '../Loading';
import { getItemLocalStorage } from '../../utils/storage.utils';
import { BRAND_ID_LOCALSTORAGE } from '../../constants/service';
const VoucherForm = ({
  onCancel,
  visible,
  title,

  onAddVoucher,
  processing,
}) => {
  const [form] = Form.useForm();
  const [current, setCurrent] = useState(0);

  const voucherInfo = useRef(null);

  const steps = [
    {
      title: 'Voucher Info',
    },
    {
      title: 'Set Voucher Date',
    },
  ];

  const stepBackHandler = () => {
    if (current > 0) {
      setCurrent(current - 1);
    }
  };

  const stepNextHandler = () => {
    form.submit();

    //setCurrent(current + 1);
  };

  const submitHandler = (values) => {
    console.log('values', values);
    switch (current) {
      case 0:
        voucherInfo.current = {
          ...values,
          photo: values.photo[0].originFileObj,
        };
        setCurrent(current + 1);
        break;
      case 1:
        const brandId = getItemLocalStorage(BRAND_ID_LOCALSTORAGE);
        const voucher = {
          ...voucherInfo.current,
          startPurchaseDate: moment
            .utc(values.purchaseDate[0])
            .local()
            .format(),
          endPurchaseDate: moment.utc(values.purchaseDate[1]).local().format(),
          startRedeemDate: moment.utc(values.redeemDate[0]).local().format(),
          endRedeemDate: moment.utc(values.redeemDate[1]).local().format(),
          brandId,
        };
        const formData = new FormData();
        Object.entries(voucher).map(([k, v]) => formData.append(`${k}`, v));

        onAddVoucher(formData);
        form.resetFields();
        setCurrent(0);
        onCancel();
        break;
      default:
        break;
    }
  };

  let stepContent = null;
  if (current === 0) {
    stepContent = <VoucherInfo />;
  } else {
    stepContent = <VoucherDate form={form} />;
  }
  return (
    <div>
      <Modal
        confirmLoading={processing}
        visible={visible}
        title={title}
        onCancel={onCancel}
        footer={null}
        okButtonProps={{
          disabled: processing,
        }}
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
  processing: state.voucher.processing,
});

const mapDispatchToProps = (dispatch) => ({
  onAddVoucher: (data) => dispatch(VoucherActions.addVoucherRequest(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(VoucherForm);
