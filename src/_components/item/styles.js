import styled from "styled-components";

export const ItemStyle = styled.div`
  user-select: none;

  border-radius: 8px;
  border: 1px solid #ccc;

  background-color: ${props => props.selected ? '#3689ff' : 'white'};
  color: ${props => props.selected ? 'white' : 'black'};

  &:focus {
    outline: none;
  }
`;