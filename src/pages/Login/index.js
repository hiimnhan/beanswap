import React from 'react';
import { Alert, Button, Form, Image, Input } from 'antd';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { AuthActions } from '../../redux/actions/auth.actions';
import { paths } from '../../constants/path';
import './styles.css';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import BeanIcon from '../../assets/images/bean-icon.png';
import LoginImage from '../../assets/images/login2.svg';
const LoginPage = ({ idToken, currentBrand, onLogin, error }) => {
  const [form] = Form.useForm();

  const submitHandler = (data) => {
    const { email, password } = data;
    onLogin(email, password);
  };

  if (idToken && !!currentBrand) {
    return <Redirect to={paths.SELECT_BRAND} />;
  }

  return (
    // <Container>
    //   <FormContainer>
    //     {/* <AppName>REWARD EXCHANGE SYSTEM</AppName> */}
    //     <Title>LOGIN</Title>
    //     {error && error.code.includes('auth') && (
    //       <Alert message="Wrong email or password" type="error" />
    //     )}
    //     <CustomForm autoComplete="off" form={form} onFinish={submitHandler}>
    //       <CustomForm.Item
    //         name="email"
    //         rules={[
    //           {
    //             required: true,
    //             message: 'Email is required',
    //           },
    //           {
    //             type: 'email',
    //             message: `It seems not like an email`,
    //           },
    //         ]}
    //       >
    //         <Input placeholder="Email" size="large" />
    //       </CustomForm.Item>
    //       <CustomForm.Item
    //         name="password"
    //         rules={[
    //           {
    //             required: true,
    //             message: 'Password is required',
    //           },
    //           {
    //             type: 'string',
    //             min: 6,
    //             message: 'Password should be more than 6 characters',
    //             validateTrigger: 'onSubmit',
    //           },
    //         ]}
    //       >
    //         <Input.Password placeholder="Password" size="large" />
    //       </CustomForm.Item>
    //       <CustomForm.Item>
    //         <CustomButton
    //           type="primary"
    //           size="large"
    //           onClick={() => form.submit()}
    //         >
    //           Login
    //         </CustomButton>
    //       </CustomForm.Item>
    //     </CustomForm>
    //   </FormContainer>
    //   <CustomLogo />
    // </Container>
    <div className="wrapper">
      <div className="login-wrapper">
        <div className="container">
          <div className="left">
            <h1 className="title">SIGN IN</h1>
            {error && error.code.includes('auth') && (
              <Alert message="Wrong email or password" type="error" />
            )}
            <div className="signin-form">
              <Form
                style={{ textAlign: 'center' }}
                form={form}
                layout="vertical"
                requiredMark={false}
                onFinish={submitHandler}
              >
                <Form.Item
                  name="email"
                  label={
                    <p
                      style={{
                        color: '#334d6e',
                        fontSize: '1.2rem',
                        fontWeight: 300,
                      }}
                    >
                      EMAIL
                    </p>
                  }
                  rules={[
                    {
                      required: true,
                      message: 'Email is required',
                    },
                    {
                      type: 'email',
                      message: `It seems not like an email`,
                    },
                  ]}
                >
                  <Input
                    className="form-input"
                    style={{ borderBottom: '2px solid #334d6e' }}
                    bordered={false}
                    prefix={
                      <UserOutlined
                        style={{ color: '#334d6e', marginRight: 10 }}
                      />
                    }
                    size="large"
                  />
                </Form.Item>
                <Form.Item
                  name="password"
                  label={
                    <p
                      style={{
                        color: '#334d6e',
                        fontSize: '1.2rem',
                        fontWeight: 300,
                      }}
                    >
                      PASSWORD
                    </p>
                  }
                  rules={[
                    {
                      required: true,
                      message: 'Password is required',
                    },
                    {
                      type: 'string',
                      min: 6,
                      message: 'Password should be more than 6 characters',
                      validateTrigger: 'onSubmit',
                    },
                  ]}
                >
                  <Input.Password
                    cclassName="form-input"
                    style={{ borderBottom: '2px solid #334d6e' }}
                    bordered={false}
                    prefix={
                      <LockOutlined
                        style={{ color: '#334d6e', marginRight: 10 }}
                      />
                    }
                    size="large"
                  />
                </Form.Item>
                <Button className="login-button" onClick={() => form.submit()}>
                  LOG IN
                </Button>
              </Form>
            </div>
          </div>
          <div className="right">
            <div className="appname">
              <p className="appname-title">REWARD EXCHANGE SYSTEM</p>
              <Image src={BeanIcon} width={50} height={50} preview={false} />
            </div>
            <div className="illutration">
              <img className="illutration-img" src={LoginImage} alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    idToken: state.auth.idToken,
    loading: state.auth.loading,
    error: state.auth.error,
    currentBrand: state.brand.currentBrand,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onLogin: (email, password) =>
      dispatch(AuthActions.loginRequest(email, password)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
