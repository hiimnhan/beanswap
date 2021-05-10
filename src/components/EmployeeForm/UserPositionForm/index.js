import React, { useEffect, useState } from 'react';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Form, Row, Select, Switch } from 'antd';

import http from '../../../configs/axios';
import { getItemLocalStorage } from '../../../utils/storage.utils';
import { BRAND_ID_LOCALSTORAGE } from '../../../constants/service';
const queryString = require('querystring');

const UserPositionForm = ({ optional, clearStores }) => {
  const [stores, setStores] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (clearStores) {
      setStores({});
    }
  }, [clearStores]);

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
      .catch((err) => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return 'Loading';
  }

  return (
    <Form.Item>
      <Form.List name="stores">
        {(fields, { add, remove }) => (
          <>
            {fields.map((field) => (
              <Row key={field.key} justify="center" align="middle" gutter={16}>
                <Col span={16}>
                  <Form.Item
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
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    initialValue={false}
                    {...field}
                    name={[field.name, 'isManager']}
                    fieldKey={[field.fieldKey, 'isManager']}
                    valuePropName="checked"
                  >
                    <Switch checkedChildren="Manager" />
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
                Add position
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </Form.Item>
  );
};

export default UserPositionForm;
