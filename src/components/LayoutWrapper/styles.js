import styled from 'styled-components';
import { Layout } from 'antd';

export const CustomLayout = styled(Layout)`
  min-height: 100vh;
`;

export const CustomHeader = styled(Layout.Header)`
  position: fixed;
  z-index: 1;
  width: 100%;
  display: flex;
  align-items: center;
`;

export const Logo = styled.div`
  float: left;
  width: 120px;
  height: 31px;
  margin: 16px 24px 16px 0;
  background: rgba(255, 255, 255, 0.2);
`;

export const CustomContent = styled(Layout.Content)`
  padding: 50px;
  margin-top: 64px;
`;

export const CustomBody = styled.div`
  padding: 24px;
  min-height: 100%;
  background: #fff;
`;

export const CustomFooter = styled(Layout.Footer)`
  text-align: center;
`;

export const Profile = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  margin-right: 16px;
  color: white;
`;
