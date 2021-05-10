import React, { useState } from 'react';
import { Button, Result } from 'antd';
import { Redirect } from 'react-router-dom';

const _404Page = () => {
  const [isRedirectToHomePage, setIsRedirectToHomePage] = useState(false);

  if (isRedirectToHomePage) {
    return <Redirect to="/" />;
  }
  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={
        <Button type="primary" onClick={() => setIsRedirectToHomePage(true)}>
          Back Home
        </Button>
      }
    />
  );
};

export default _404Page;
