import { useState, useCallback } from "react";

import { DragDropContext } from "react-beautiful-dnd";

import { List, Item } from "@components";

const Context = () => {
  const [columns, setCoulmns] = useState(1);

  const getItems = (count) =>
    Array.from({ length: count }, (_, k) => k).map((k) => ({
      id: `item-${k}`,
      content: `item ${k}`,
    }));

  const [items, setItems] = useState(getItems(10));

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const onDragEnd = useCallback(
    (result) => {
      if (!result.destination) {
        return;
      }

      const newItems = reorder(
        items,
        result.source.index,
        result.destination.index
      );

      setItems(newItems);
    },
    [items]
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {
        Array.from({ length: columns }, (_, k) => k).map((k) => {
          const key = `droppable-${k + 1}`;

          return (
            <List key={key} id={key}>
              {
                items.map((item, index) => {
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
  )
}

export { Context };