import styled from "styled-components";

export const ContainerStyle = styled.div`
  position: relative;
`;

export const ToggleButtonStyle = styled.button`
  height: 40px;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 12px 20px 12px 12px;

  &::before {
    content: "";
    display: block;
    width: 8px;
    height: 8px;
    position: absolute;
    right: 5px;
    top: 16px;
    transition: all 0.2s;
    transform: ${props => props.$clicked ? "translate(5px, -1px) rotate(225deg);" : "translate(0, -1px) rotate(225deg)"};
    border-top: 2px solid #aaa;
  }

  &::after {
    content: "";
    display: block;
    width: 8px;
    height: 8px;
    position: absolute;
    right: 5px;
    top: 16px;
    transition: all 0.2s;
    transform: ${props => props.$clicked ? "translate(-4px, -1px) rotate(135deg);" : "translate(0, -1px) rotate(135deg)"};
    border-top: 2px solid #aaa;
  }
`;

export const ModalStyle = styled.div`
  position: absolute;
  top: 36px;
  right: 0;

  padding: 12px;

  border-radius: 8px;
  background-color: white;
  border: 1px solid #eee;

  z-index: 100;

  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const SettingButtonStyle = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  
  white-space: nowrap;

  color: white;

  border-radius: 8px;

  padding: 12px;

  transition: all 600ms cubic-bezier(0.13, 0.67, 0.01, 0.94);

  &:disabled, &:disabled:hover {
    background-color: ${({ theme }) => theme.backgroundColor.disable};
  }
`;

export const AddButtonStyle = styled(SettingButtonStyle)`
  background-color: ${({ theme }) => theme.backgroundColor.main};

  &:hover {
    background-color: ${({ theme }) => theme.backgroundColor.mainHilight};
  }
`;

export const RemoveButtonStyle = styled(SettingButtonStyle)`
  background-color: ${({ theme }) => theme.backgroundColor.cancel};

  &:hover {
    background-color: ${({ theme }) => theme.backgroundColor.cancelHilight};
  }
`;