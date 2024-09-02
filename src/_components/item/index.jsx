import React from 'react';

import { Draggable } from "react-beautiful-dnd";

import { getItemStyle, checkEventType } from "@utils";

import * as s from './styles';

const _Item = ({ item, index, isSelected, isExtra, isError, selectedCount, changeSelect }) => {
  const action = (event) => {
    const type = checkEventType(event);

    changeSelect(type, item.id);
  }

  // 키다운 이벤트 처리
  const onKeyDown = (event, snapshot) => {
    if (event.defaultPrevented || snapshot.isDragging || event.keyCode !== 13) {
      return;
    }

    event.preventDefault();

    action(event);
  }

  // 클릭 이벤트 처리
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
            $selected={isSelected}
            $disabled={isExtra}
            $invalid={isError}
            onClick={onClick}
            onKeyDown={(event) => { onKeyDown(event, snapshot) }}
          >
            {item.content}
            {
              // 여러 아이템을 선택 후 드래그할 경우 옆에 선택된 아이템 개수 표시
              snapshot.isDragging && selectedCount > 1 &&
              <s.SelectedCount>{selectedCount}</s.SelectedCount>
            }
          </s.ItemStyle>
        )
      }}
    </Draggable>
  )
}

export const Item = React.memo(_Item);