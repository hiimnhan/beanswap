import styled from 'styled-components';

import { appColors } from '../../assets/styles/colors';

export const Header = styled.div`
  margin: 2rem 4rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Title = styled.h2`
  min-width: 14.32rem;
  height: 1.88rem;
  color: ${appColors.blueMI};
  font-size: 40px;
`;
