import { Draggable } from "react-beautiful-dnd";

import { getItemStyle, checkEventType } from "@utils";

import * as s from './styles';

const Item = ({ item, index, isSelected, selectedCount, draggingItem, changeSelect }) => {
  const action = (event) => {
    const type = checkEventType(event);

    changeSelect(type, item.id);
  }

  const onKeyDown = (event, snapshot) => {
    if (event.defaultPrevented || snapshot.isDragging || event.keyCode !== 13) {
      return;
    }

    event.preventDefault();

    action(event);
  }

  const onClick = (event) => {
    if (event.defaultPrevented || event.button !== 0) {
      return;
    }

    event.preventDefault();

    action(event);
  };

  return (
    <Draggable key={item.id} draggableId={item.id} index={index}>
      {(provided, snapshot) => {
        return (
          <s.ItemStyle
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={getItemStyle(
              provided.draggableProps.style
            )}
            selected={isSelected}
            disabled={draggingItem && isSelected && draggingItem !== item.id}
            onClick={onClick}
            onKeyDown={(event) => { onKeyDown(event, snapshot) }}
          >
            {item.content}
            {
              snapshot.isDragging && selectedCount > 1 &&
              <s.SelectedCount>{selectedCount}</s.SelectedCount>
            }
          </s.ItemStyle>
        )
      }}
    </Draggable>
  )
}

export { Item };