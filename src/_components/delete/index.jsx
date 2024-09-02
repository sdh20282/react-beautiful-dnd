import React from 'react';

import { Droppable } from "react-beautiful-dnd";

import { getDeleteStyle } from '@utils';

import * as s from './styles';

const Delete = ({ id }) => {
  return (
    <Droppable droppableId={id}>
      {(provided, snapshot) => {
        return (
          <s.DeleteStyle
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={getDeleteStyle(snapshot.isDraggingOver)}
          >
            <s.TextStyle>drop items to remove</s.TextStyle>
            {provided.placeholder}
          </s.DeleteStyle>
        )
      }}
    </Droppable>
  )
}

export { Delete };