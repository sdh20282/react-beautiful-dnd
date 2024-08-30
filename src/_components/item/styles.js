import styled from "styled-components";

import { getBackgroundColor, getColor } from '@utils';

export const ItemStyle = styled.div`
  position: relative;

  user-select: none;

  border-radius: 8px;
  border: 1px solid #ccc;

  background-color: ${props => getBackgroundColor(props)};
  color: ${props => getColor(props)};

  &:focus {
    outline: none;
  }
`;

export const SelectedCount = styled.p`
  position: absolute;
  
  top: -5px;
  right: 5px;

  width: 20px;
  height: 20px;

  background-color: #ff4d4d;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;
`;