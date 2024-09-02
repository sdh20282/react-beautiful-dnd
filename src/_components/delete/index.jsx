import React from 'react';

import { Droppable } from "react-beautiful-dnd";

import { getDeleteStyle } from '@utils';

import * as s from './styles';

const Delete = ({ children, id }) => {
  return (
    <Droppable droppableId={id}>
      {(provided, snapshot) => {
        return (
          <s.DeleteStyle
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={getDeleteStyle(snapshot.isDraggingOver)}
          >
            {children}
            {provided.placeholder}
          </s.DeleteStyle>
        )
      }}
    </Droppable>
  )
}

export { Delete };