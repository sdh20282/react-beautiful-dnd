import { useState, useCallback } from "react";

import { DragDropContext } from "react-beautiful-dnd";

import { List, Item } from "@components";
import { getItems, removeItem, insertItem } from "@utils";
import { ITEM_COUNT } from "@data";

import * as s from './styles';

const Context = () => {
  const [columns, setCoulmns] = useState(4);
  const [items, setItems] = useState(Array.from({ length: columns }, (_, i) => i).reduce((acc, _, idx) => {
    const current = {
      ...acc,
      [`item-${idx + 1}`]: idx === 0 ? getItems(ITEM_COUNT) : [],
    };

    return current;
  }, {}));

  const onDragUpdate = (result) => {
    // console.log(result);
  }

  const onDragEnd = useCallback(
    (result) => {
      if (!result.destination) {
        return;
      }

      const [
        from,
        fromIndex,
        to,
        toIndex
      ] = [
          `item-${result.source.droppableId.slice(-1)}`,
          result.source.index,
          `item-${result.destination.droppableId.slice(-1)}`,
          result.destination.index
        ];

      const { arr, item } = removeItem(items[from], fromIndex);
      const target = insertItem(items[to], item, toIndex);

      const newItems = {
        ...items,
        [from]: arr,
        [to]: target,
      };

      setItems(newItems);
    },
    [items]
  );

  return (
    <s.ContainerStyle>
      <s.ContextContainerStyle>
        <DragDropContext onDragUpdate={onDragUpdate} onDragEnd={onDragEnd}>
          {
            Array.from({ length: columns }, (_, i) => i).map((i) => {
              const key = `droppable-${i + 1}`;

              return (
                <List key={key} id={key}>
                  {
                    items[`item-${i + 1}`].map((item, index) => {
                      const key = `draggable-${index + 1}`;

                      return (
                        <Item
                          key={key}
                          item={item}
                          index={index}
                        />
                      )
                    })
                  }
                </List>
              )
            })
          }
        </DragDropContext>
      </s.ContextContainerStyle>
    </s.ContainerStyle>
  )
}

export { Context };