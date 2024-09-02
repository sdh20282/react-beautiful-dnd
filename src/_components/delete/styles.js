import styled from "styled-components";

export const DeleteStyle = styled.div`
  position: relative;

  overflow: hidden;

  width: 280px;
  height: 80px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 12px;

  transition: all 600ms cubic-bezier(0.13, 0.67, 0.01, 0.94);
`;

export const TextStyle = styled.p`
  position: absolute;

  user-select: none;
  white-space: nowrap;

  top: 50%;
  left: 50%;
  
  color: white;

  transform: translate(-50%, -50%);
`;