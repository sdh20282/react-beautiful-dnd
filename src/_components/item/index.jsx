import { Draggable } from "react-beautiful-dnd";

import { getItemStyle } from "@utils";

import * as s from './styles';

const Item = ({ item, index }) => {
  return (
    <Draggable key={item.id} draggableId={item.id} index={index}>
      {(provided, snapshot) => {
        return (
          <s.ItemStyle
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={getItemStyle(
              snapshot.isDragging,
              provided.draggableProps.style
            )}
          >
            {item.content}
          </s.ItemStyle>
        )
      }}
    </Draggable>
  )
}

export { Item };