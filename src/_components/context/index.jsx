import { useState, useCallback, useEffect } from "react";

import { DragDropContext } from "react-beautiful-dnd";

import { Column, Item } from "@components";
import { getEntities, updateSelected, reorder, windowEventHandler } from "@utils";
import { COLUMN_COUNT, ITEM_COUNT } from "@data";

import * as s from './styles';

const Context = () => {
  // 기본 정보
  const [info, setInfo] = useState({
    items: ITEM_COUNT,
    columns: COLUMN_COUNT
  });

  // 상태 정보
  const [state, setState] = useState({
    entities: getEntities(info.columns, info.items),
    selected: [],
    dragging: null
  });

  // 선택된 아이템 전부 제거
  const unSelectAll = useCallback(() => {
    setState(s => ({
      ...s,
      selected: []
    }));
  }, []);

  // 드래그 시작 시
  const onDragStart = useCallback((start) => {
    const id = start.draggableId;
    const selected = state.selected.find(i => i === id);

    // 현재 드래그하는 아이템이 selected 리스트에 있지 않을 경우 갱신
    const selectedList = !selected ? [id] : state.selected;

    // 어떤 아이템 드래그중인지 설정
    setState(s => ({
      ...s,
      selected: selectedList,
      dragging: id
    }));
  }, [state]);

  const onDragUpdate = (update) => {
    // console.log(update);
  }

  // 드래그 종료 시
  const onDragEnd = useCallback((end) => {
    // destination이 column이 아니거나 cancel 시 드래그 중인 아이템 초기화
    if (!end.destination || end.reason === 'CANCEL') {
      setState(s => ({
        ...s,
        dragging: null
      }));

      return;
    }

    // 새로운 state 생성
    const newState = reorder(state.entities, state.selected, end.destination);

    // 업데이트
    setState(s => ({
      ...s,
      ...newState,
      dragging: null,
    }));
  }, [state]);

  // 아이템 선택
  const changeSelect = useCallback((type, id) => {
    const newSelected = updateSelected(type, state.entities, state.selected, id);

    // 선택된 아이템 리스트 업데이트
    setState(s => ({
      ...s,
      selected: newSelected
    }));
  }, [state]);

  // 멀티 드래그 해제를 위해 window 객체에 관련 이벤트 핸들러 등록
  useEffect(() => {
    const windowEvents = Object.keys(windowEventHandler);
    const eventHandlers = windowEvents.reduce((acc, cur) => {
      const current = {
        ...acc,
        [cur]: (event) => { windowEventHandler[cur](event, unSelectAll) },
      };

      return current;
    }, {});

    windowEvents.forEach(e => {
      window.addEventListener(e, eventHandlers[e]);
    });

    return () => {
      windowEvents.forEach(e => {
        window.removeEventListener(e, eventHandlers[e]);
      });
    };
  }, []);

  return (
    <s.ContainerStyle>
      <s.ContextContainerStyle>
        <DragDropContext onDragStart={onDragStart} onDragUpdate={onDragUpdate} onDragEnd={onDragEnd}>
          {
            state.entities.columns.map((column) => {
              return (
                <Column key={column} id={column}>
                  {
                    state.entities.columnItems[column].map((item, index) => {
                      return (
                        <Item
                          key={state.entities.items[item].id}
                          item={state.entities.items[item]}
                          index={index}
                          isSelected={state.selected.includes(item)}
                          selectedCount={state.selected.length}
                          draggingItem={state.dragging}
                          changeSelect={changeSelect}
                        />
                      )
                    })
                  }
                </Column>
              )
            })
          }
        </DragDropContext>
      </s.ContextContainerStyle>
    </s.ContainerStyle>
  )
}

export { Context };