import { GRID } from '@data';

export const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? 'lightblue' : '#EEE',
  padding: GRID,
});

export const getItemStyle = (draggableStyle) => ({
  padding: GRID * 2,
  margin: `0 0 ${GRID}px 0`,
  ...draggableStyle,
});

export const getBackgroundColor = ({ selected, disabled }) => {
  if (disabled) {
    return '#352435';
  }

  if (selected) {
    return '#3689ff';
  }

  return '#ffffff';
}

export const getColor = ({ selected, disabled }) => {
  if (disabled) {
    return '#cccccc';
  }

  if (selected) {
    return '#ffffff';
  }

  return '#000000';
}