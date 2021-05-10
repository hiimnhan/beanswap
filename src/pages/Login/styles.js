import { Button, Form } from 'antd';
import styled from 'styled-components';

import { appColors } from '../../assets/styles/colors';
import { ReactComponent as Logo } from '../../assets/images/login.svg';

export const Container = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const CustomLogo = styled(Logo)`
  flex: 2;
`;

export const FormContainer = styled.div`
  flex: 1;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const CustomForm = styled(Form)`
  width: 80%;
`;

export const CustomButton = styled(Button)`
  width: 100%;
`;

export const Title = styled.div`
  font-size: 64px;
  font-weight: bold;
  color: ${appColors.blueMI};
`;

export const AppName = styled(Title)`
  color: ${appColors.greenDark};
`;
