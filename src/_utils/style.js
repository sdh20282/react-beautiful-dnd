import { GRID, ITEM_HEIGHT } from '@data';

// 리스트 스타일 계산
export const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? 'lightblue' : '#EEE',
  padding: GRID,
  gap: GRID,
});

// 아이템 스타일 계산
export const getItemStyle = (draggableStyle) => ({
  padding: `0 ${GRID * 2}px 0 ${GRID * 2}px`,
  height: ITEM_HEIGHT,
  ...draggableStyle,
});

// 배경색 계산
export const getBackgroundColor = ({ $selected, $disabled, $invalid }) => {
  if ($disabled) {
    return '#352435';
  }

  if ($invalid) {
    return '#ff4d4d';
  }

  if ($selected) {
    return '#3689ff';
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