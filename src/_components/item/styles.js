import styled from "styled-components";

import { getBackgroundColor, getColor, getBorder } from '@utils';

export const ItemStyle = styled.li`
  position: relative;

  display: flex;
  align-items: center;

  user-select: none;

  border-radius: 8px;
  
  border: ${props => getBorder(props)};
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

  width: 24px;
  height: 24px;

  background-color: ${({ theme }) => theme.backgroundColor.cancelHilight};

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;
`;