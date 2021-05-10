import { Modal } from 'antd';
import React from 'react';

const RemoveForm = ({
  visible,
  title,
  loading,
  description,
  onCancel,
  onFinish,
}) => {
  return (
    <Modal
      visible={visible}
      title={title}
      onCancel={onCancel}
      confirmLoading={loading}
      okButtonProps={{ danger: true }}
      onOk={onFinish}
    >
      {description}
    </Modal>
  );
};

export default RemoveForm;
