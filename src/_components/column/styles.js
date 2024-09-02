import styled from "styled-components";

export const ListStyle = styled.div`
  width: 200px;
  height: 60vh;

  display: flex;
  flex-direction: column;

  overflow-y: scroll;

  border-radius: 10px;

  transition: all 600ms cubic-bezier(0.13, 0.67, 0.01, 0.94);

  &::-webkit-scrollbar {
    width: 6px;
    background-color: #eee;
  }

  &::-webkit-scrollbar-track {
    background-color: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #ddd;
    border-radius: 10px;
    background-clip: padding-box;
    
    cursor: grab;
  }

  &::-webkit-scrollbar-button {
    width: 0;
    height: 0;
  }
`;