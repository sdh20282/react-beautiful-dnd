import { GRID } from '@data';

export const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? "lightblue" : "#EEE",
  padding: GRID,
});

export const getItemStyle = (draggableStyle) => ({
  padding: GRID * 2,
  margin: `0 0 ${GRID}px 0`,
  ...draggableStyle,
});