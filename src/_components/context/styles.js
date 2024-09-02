import styled from "styled-components";

import { IROnly } from '@styles';

export const ContainerStyle = styled.main`
  display: flex;
  flex-direction: column;
`;

export const SettingContainerStyle = styled.section`
  display: flex;
  align-items: center;
  gap: 12px;

  margin-left: auto;

  & > header {
    ${IROnly};
  }
`;

export const ContextContainerStyle = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 80px;

  & > header {
    ${IROnly}
  }
`;

export const ColumnListStyle = styled.div`
  display: flex;
  
  gap: 10px;
`