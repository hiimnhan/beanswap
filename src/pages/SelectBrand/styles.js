import styled from 'styled-components';

import { appColors } from '../../assets/styles/colors';

export const Wrapper = styled.div`
  margin: 100px 0;
  text-align: center;
`;

export const BrandContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
`;

export const BrandImgContainer = styled.div`
  width: 150px;
  height: 150px;
  border: 6px solid #1f1f1f;
  margin: 30px 30px;
`;

export const BrandImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const BrandName = styled.div`
  margin: 20px 0;
  line-height: 1.25em;
`;

export const BrandProfile = styled.div`
  width: 150px;

  &:hover {
    cursor: pointer;
  }

  &:hover ${BrandImgContainer} {
    border: 6px solid ${appColors.blueMI};
  }

  &:hover ${BrandName} {
    color: ${appColors.blueMI};
  }
`;
