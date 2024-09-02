import { GRID, ITEM_HEIGHT } from '@data';
import { theme } from '@styles';

// 리스트 스타일 계산
export const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? theme.backgroundColor.listHover : theme.backgroundColor.list,
  padding: `${GRID}px ${GRID}px 0 ${GRID}px`,
});

export const getDeleteStyle = (isDraggingOver) => ({
  background: isDraggingOver ? theme.backgroundColor.cancelHilight : theme.backgroundColor.cancel,
});

// 아이템 스타일 계산
export const getItemStyle = (draggableStyle) => ({
  padding: `0 ${GRID * 2}px 0 ${GRID * 2}px`,
  margin: `0 0 ${GRID}px 0`,
  height: ITEM_HEIGHT,
  ...draggableStyle,
});

// 배경색 계산
export const getBackgroundColor = ({ $selected, $disabled, $invalid }) => {
  if ($disabled) {
    return theme.backgroundColor.itemDisabled;
  }

  if ($invalid) {
    return '#f46b70';
  }

  if ($selected) {
    return '#646ef3';
  }

  return '#ffffff';
}

// 글자색 계산
export const getColor = ({ $selected, $disabled, $invalid }) => {
  if ($disabled) {
    return '#cccccc';
  }

  if ($selected || $invalid) {
    return '#ffffff';
  }

  return '#000000';
}

export const getBorder = ({ $selected }) => {
  if ($selected) {
    return 'none';
  }

  return '1px solid #cccccc';
}