import React, { useEffect } from 'react';
import { Avatar, Dropdown, Image, Menu } from 'antd';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { DownOutlined, ReloadOutlined } from '@ant-design/icons';
import BeanIcon from '../../assets/images/bean-icon.png';
import {
  CustomBody,
  CustomContent,
  CustomFooter,
  CustomHeader,
  CustomLayout,
  Profile,
  Logo,
} from './styles';
import navbar from '../../constants/navbar';
import { AuthActions } from '../../redux/actions/auth.actions';
import { BrandActions } from '../../redux/actions/brand.actions';
import { store } from '../../redux/store';
import { numberFormat } from '../../utils/format.utils';

const LayoutWrapper = ({
  history,
  children,
  employeeInfo,
  onSignout,
  onGetBalance,
  balance,
}) => {
  const { walletAddress, bannerUrl } = store.getState().brand?.currentBrand;
  useEffect(() => {
    onGetBalance(walletAddress);
  }, [onGetBalance, walletAddress]);
  return (
    <CustomLayout>
      <CustomHeader>
        <Image
          src={bannerUrl}
          width={120}
          height={31}
          preview={false}
          onClick={() => history.push('/')}
          style={{ cursor: 'pointer', objectFit: 'cover' }}
        />
        <div
          style={{
            display: 'flex',
            flex: 1,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Menu theme="dark" mode="horizontal">
            {navbar.map((item) => (
              <Menu.Item key={item.id} onClick={() => history.push(item.path)}>
                {item.title}
              </Menu.Item>
            ))}
          </Menu>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <Profile onClick={() => onGetBalance(walletAddress)}>
              {numberFormat(balance)}
              <Image src={BeanIcon} width={20} height={20} preview={false} />
            </Profile>
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item onClick={() => history.push('/select-brand')}>
                    Change brand
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Item
                    onClick={() => {
                      onSignout();
                    }}
                  >
                    Sign out
                  </Menu.Item>
                </Menu>
              }
              placement="bottomRight"
            >
              <Profile>
                <div style={{ marginRight: '0.5rem' }}>
                  {employeeInfo.firstName} {employeeInfo.lastName}
                </div>
                <Avatar src={employeeInfo.photoUrl} shape="square" />
                <DownOutlined
                  style={{ marginLeft: '0.5rem', fontSize: '0.6rem' }}
                />
              </Profile>
            </Dropdown>
          </div>
        </div>
      </CustomHeader>
      <CustomContent>
        <CustomBody>{children}</CustomBody>
      </CustomContent>
      <CustomFooter>BeanSwap ©2021</CustomFooter>
    </CustomLayout>
  );
};

const mapStateToProps = (state) => ({
  employeeInfo: state.employee.employeeInfo,
  balance: state.brand.balance,
});

const mapDispatchToProps = (dispatch) => ({
  onSignout: () => dispatch(AuthActions.logout()),
  onGetBalance: (address) => dispatch(BrandActions.getBalanceRequest(address)),
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(LayoutWrapper)
);
