import { Form, Select, Switch } from 'antd';
import React, { useEffect, useState } from 'react';

import http from '../../configs/axios';
import { BRAND_ID_LOCALSTORAGE } from '../../constants/service';
import { getItemLocalStorage } from '../../utils/storage.utils';
const queryString = require('querystring');

const EmployeeStoreForm = () => {
  const [stores, setStores] = useState({});
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
      .catch((err) => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return 'Loading Stores ...';
  }

  return (
    <>
      <Form.Item label="Store" name="storeId">
        <Select placeholder="Select a store">
          {stores?.data?.map((s) => (
            <Select.Option key={s.id}>{s.name}</Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label="Manager" name="isManager" valuePropName="checked">
        <Switch defaultChecked={false} checkedChildren="Manager" />
      </Form.Item>
    </>
  );
};

export default EmployeeStoreForm;
