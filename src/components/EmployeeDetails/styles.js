import styled from 'styled-components';

export const AvatarContainer = styled.div`
  width: 50%;
  height: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const AvatarImage = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  margin-bottom: 20px;
  object-fit: cover;
`;

export const TitleText = styled.div`
  font-size: 20px;
  font-weight: 600;
  text-align: center;
`;

export const InfoContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const InfoRow = styled.div`
  width: 100%;
  padding: 8px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

export const IconContainer = styled.div`
  margin: 0 8px;
`;

export const ContentText = styled.div`
  font-size: 16px;
  font-weight: 500;
`;
