import React from 'react';

import { Droppable } from "react-beautiful-dnd";

import { getListStyle } from '@utils';

import * as s from './styles';

const List = ({ children, id }) => {
  return (
    <Droppable droppableId={id}>
      {(provided, snapshot) => (
        <s.ListStyle
          {...provided.droppableProps}
          ref={provided.innerRef}
          style={getListStyle(snapshot.isDraggingOver)}
        >
          {children}
          {provided.placeholder}
        </s.ListStyle>
      )}
    </Droppable>
  )
}

export { List };