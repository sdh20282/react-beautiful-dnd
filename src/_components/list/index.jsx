import React from 'react';

import { Droppable } from "react-beautiful-dnd";

import { getListStyle } from '@utils';

const List = ({ children, id }) => {
  return (
    <Droppable droppableId={id}>
      {(provided, snapshot) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          style={getListStyle(snapshot.isDraggingOver)}
        >
          {children}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  )
}

export { List };