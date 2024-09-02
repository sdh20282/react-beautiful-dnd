import React from 'react';

import { Droppable } from "react-beautiful-dnd";

import { getListStyle } from '@utils';

import * as s from './styles';

const Column = ({ children, id, inValid }) => {
  return (
    <Droppable droppableId={id} isDropDisabled={inValid}>
      {(provided, snapshot) => {
        return (
          <s.ListStyle
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={getListStyle(snapshot.isDraggingOver)}
          >
            <ul>
              {children}
            </ul>
            {provided.placeholder}
          </s.ListStyle>
        )
      }}
    </Droppable>
  )
}

export { Column };