import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Form, InputNumber, Row, Select } from 'antd';
import React, { useState, useEffect } from 'react';
import http from '../../../configs/axios';
import { BRAND_ID_LOCALSTORAGE } from '../../../constants/service';
import { getItemLocalStorage } from '../../../utils/storage.utils';
const queryString = require('querystring');
const RuleStore = () => {
  const { Item, List } = Form;
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const brandId = getItemLocalStorage(BRAND_ID_LOCALSTORAGE);
    const query = queryString.stringify({
      status: 1,
      brandId,
    });
    http
      .get(`/stores?${query}`, {
        headers: {
          brandId,
        },
      })
      .then((res) => {
        setStores(res.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  }, []);
  return (
    <Item>
      <List name="stores">
        {(fields, { add, remove }) => (
          <>
            {fields.map((field) => (
              <Row key={field.key} justify="center" align="middle" gutter={16}>
                <Col span={16}>
                  <Item
                    {...field}
                    name={[field.name, 'storeId']}
                    fieldKey={[field.fieldKey, 'storeId']}
                    rules={[
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          const stores = getFieldValue('stores');
                          const amountOfItem = stores.filter(
                            (s) => s.storeId === value
                          ).length;
                          if (amountOfItem > 1) {
                            return Promise.reject('Store existed.');
                          }
                          return Promise.resolve();
                        },
                      }),
                    ]}
                  >
                    <Select placeholder="Select a store">
                      {stores?.data?.map((s) => (
                        <Select.Option key={s.id}>{s.name}</Select.Option>
                      ))}
                    </Select>
                  </Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    initialValue={false}
                    {...field}
                    name={[field.name, 'amount']}
                    fieldKey={[field.fieldKey, 'amount']}
                    valuePropName="checked"
                  >
                    <InputNumber min={1} placeholder="amount" />
                  </Form.Item>
                </Col>
                <Col span={2}>
                  <Form.Item>
                    <MinusCircleOutlined onClick={() => remove(field.name)} />
                  </Form.Item>
                </Col>
              </Row>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
              >
                Add store
              </Button>
            </Form.Item>
          </>
        )}
      </List>
    </Item>
  );
};

export default RuleStore;
