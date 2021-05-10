import { Avatar, Form, Image, Input, Modal, Tag } from 'antd';
import moment from 'moment';
import React, { useEffect } from 'react';
import BeanIcon from '../../assets/images/bean-icon.png';
import { DATE_FORMAT } from '../../constants/format';
import { numberFormat } from '../../utils/format.utils';
import './styles.css';

const colorList = ['success', 'warning', 'error'];
const typeList = ['Discount', 'Money', 'Product'];
const VoucherDetail = ({ item, visible, title, onCancel }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (item) {
      form.setFieldsValue({
        name: item.name,
        description: item.description,
        price: item.price,
        limit: item.limit,
        startPurchaseDate: moment
          .utc(item.startPurchaseDate)
          .local()
          .format(DATE_FORMAT),
        endPurchaseDate: moment
          .utc(item.endPurchaseDate)
          .local()
          .format(DATE_FORMAT),
        startRedeemDate: moment
          .utc(item.startRedeemDate)
          .local()
          .format(DATE_FORMAT),
        endRedeemDate: moment
          .utc(item.endRedeemDate)
          .local()
          .format(DATE_FORMAT),
      });
    }
  }, [item, form]);
  return (
    <Modal
      visible={visible}
      title={title}
      footer={null}
      onCancel={onCancel}
      width={800}
    >
      <div className="flex-container">
        <div className="avatar">
          <Avatar
            style={{ marginBottom: 20 }}
            src={item?.photoUrl}
            size={150}
            shape="square"
          />
          {<Tag color={colorList[item?.type]}>{typeList[item?.type]}</Tag>}
        </div>
        <div className="info">
          <Form
            layout="vertical"
            form={form}
            style={{ marginTop: 30, marginLeft: 20 }}
          >
            <Form.Item
              name="name"
              initialValue={item?.name}
              label="Name"
              style={{ marginRight: 20 }}
            >
              <Input
                style={{ borderBottom: '2px solid #334d6e' }}
                className="detail-input"
                bordered={false}
              />
            </Form.Item>

            <Form.Item
              name="description"
              initialValue={item?.description}
              label="Description"
            >
              <Input.TextArea
                size="large"
                style={{ borderBottom: '2px solid #334d6e' }}
                className="detail-input"
                bordered={false}
              />
            </Form.Item>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <Form.Item
                name="price"
                initialValue={numberFormat(item?.price)}
                label="Price"
                style={{ marginRight: 20 }}
              >
                <Input
                  style={{ borderBottom: '2px solid #334d6e' }}
                  className="detail-input"
                  bordered={false}
                  prefix={
                    <Image
                      src={BeanIcon}
                      width={20}
                      height={20}
                      preview={false}
                    />
                  }
                />
              </Form.Item>
              <Form.Item name="limit" initialValue={item?.limit} label="Limit">
                <Input
                  style={{ borderBottom: '2px solid #334d6e' }}
                  className="detail-input"
                  bordered={false}
                />
              </Form.Item>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <Form.Item
                name="startPurchaseDate"
                label="Start Purchase "
                style={{ marginRight: 20 }}
              >
                <Input
                  style={{ borderBottom: '2px solid #334d6e' }}
                  className="detail-input"
                  bordered={false}
                />
              </Form.Item>
              <Form.Item name="endPurchaseDate" label="End Purchase">
                <Input
                  style={{ borderBottom: '2px solid #334d6e' }}
                  className="detail-input"
                  bordered={false}
                />
              </Form.Item>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <Form.Item
                name="startRedeemDate"
                label="Start Redeem"
                style={{ marginRight: 20 }}
              >
                <Input
                  style={{ borderBottom: '2px solid #334d6e' }}
                  className="detail-input"
                  bordered={false}
                />
              </Form.Item>
              <Form.Item name="endRedeemDate" label="End Redeem">
                <Input
                  style={{ borderBottom: '2px solid #334d6e' }}
                  className="detail-input"
                  bordered={false}
                />
              </Form.Item>
            </div>
          </Form>
        </div>
      </div>
    </Modal>
  );
};

export default VoucherDetail;
