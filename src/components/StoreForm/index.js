import { PlusCircleOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Upload } from 'antd';
import React, { useEffect } from 'react';

const StoreForm = ({
  form,
  visible,
  item,
  title,
  loading,
  onCancel,
  onFinish,
}) => {
  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }

    return e && e.fileList;
  };

  useEffect(() => {
    if (item) {
      form.setFieldsValue({
        id: item?.id,
        code: item?.code,
        name: item?.name,
        address: item?.address,
      });
    }
  }, [form, item]);

  const isEditing = item != null;

  return (
    <Modal
      okText={item ? 'Update' : 'Create'}
      okButtonProps={{
        icon: <PlusCircleOutlined />,
      }}
      visible={visible}
      title={title}
      onCancel={onCancel}
      onOk={() => form.submit()}
      confirmLoading={loading}
    >
      {/* <Image src={currentPhoto} /> */}
      <Form form={form} onFinish={onFinish}>
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>
        <Form.Item
          name="code"
          rules={[{ required: true, message: 'Code is required' }]}
        >
          <Input disabled={isEditing} size="large" placeholder="Code" />
        </Form.Item>
        <Form.Item
          name="photo"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Upload
            maxCount={1}
            accept="image/*"
            name="logo"
            listType="picture"
            beforeUpload={(file, fileList) => {
              return false;
            }}
          >
            <Button size="large" icon={<UploadOutlined />}>
              {isEditing ? 'Choose New Photo' : 'Choose Photo'}
            </Button>
          </Upload>
        </Form.Item>
        <Form.Item
          name="name"
          rules={[{ required: true, message: 'Name is required' }]}
        >
          <Input size="large" placeholder="Name" />
        </Form.Item>
        <Form.Item
          name="address"
          rules={[{ required: true, message: 'Address is required' }]}
        >
          <Input size="large" placeholder="Address" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default StoreForm;
