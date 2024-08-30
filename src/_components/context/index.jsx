import { useState, useCallback, useEffect, useRef } from "react";

import { DragDropContext } from "react-beautiful-dnd";

import { Column, Item } from "@components";
import { getEntities, initSelected, initError, updateSelected, reorder, windowEventHandler, checkColumnException, checkEvenItemException } from "@utils";
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
    selected: initSelected(),
    dragging: null
  });

  // 에러 정보
  const [error, setError] = useState(initError());

  const drag = useRef(false);
  const animationFrame = useRef(null);

  // 선택된 아이템 전부 제거
  const unSelectAll = useCallback(() => {
    setState(s => ({
      ...s,
      selected: initSelected(),
    }));
  }, []);

  // 드래그 시작 시
  const onDragStart = useCallback((start) => {
    if (!start.source) {
      return;
    }

    drag.current = true;

    const id = start.draggableId;
    const selected = state.selected.ordered.find(i => i === id);

    // 현재 드래그하는 아이템이 selected 리스트에 있지 않을 경우 갱신
    const updated = !selected ? {
      list: [id],
      ordered: [id],
      columns: [start.source.droppableId],
    } : state.selected;

    // 어떤 아이템 드래그중인지 설정
    setState(s => ({
      ...s,
      selected: updated,
      dragging: id
    }));
  }, [state]);

  // 업데이트 시
  const onDragUpdate = (update) => {
    if (!update.destination) {
      return;
    }

    // 첫번째 열 -> 세번째 열로 바로 이동하는 경우
    if (checkColumnException(state.selected.columns, update)) {
      setError({
        error: true,
        message: '첫번째 열의 아이템은 세번째 열로 이동할 수 없습니다.',
        target: update.destination.droppableId
      });

      return;
    }

    if (checkEvenItemException(state.entities.columnItems[update.destination.droppableId], state.selected.list, state.selected.ordered[state.selected.ordered.length - 1], update.destination.index, state.dragging)) {
      setError({
        error: true,
        message: '짝수 아이템은 다른 짝수 아이템 앞으로 올 수 없습니다.',
        target: update.destination.droppableId
      })

      return;
    }

    if (error.error) {
      setError(initError());
    }
  }

  // 드래그 종료 시
  const onDragEnd = useCallback((end) => {
    drag.current = false;

    // destination이 column이 아니거나 cancel, error시 드래그 중인 아이템 초기화
    if (!end.destination || end.reason === 'CANCEL' || error.error) {
      setError(initError());

      setState(s => ({
        ...s,
        dragging: null
      }));

      return;
    }

    // 새로운 state 생성
    const newState = reorder(state.entities, state.selected, state.dragging, end.source, end.destination);

    // 업데이트
    setState(s => ({
      ...s,
      ...newState,
      dragging: null,
    }));
  }, [state, error]);

  // 아이템 선택
  const changeSelect = useCallback((type, id) => {
    const updated = updateSelected(type, state.entities, state.selected, id);

    // 선택된 아이템 리스트 업데이트
    setState(s => ({
      ...s,
      selected: updated
    }));
  }, [state]);

  // console.log('render');


  // const test = useCallback(() => {
  //   if (!drag.current) {
  //     return;
  //   }

  //   if (animationFrame.current) {
  //     return;
  //   }

  //   animationFrame.current = requestAnimationFrame(() => {
  //     setError(initError());

  //     animationFrame.current = null;
  //   });
  // }, []);

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

    // window.addEventListener('mousemove', test);

    windowEvents.forEach(e => {
      window.addEventListener(e, eventHandlers[e]);
    });

    return () => {
      windowEvents.forEach(e => {
        window.removeEventListener(e, eventHandlers[e]);
      });

      // window.removeEventListener('mousemove', test);
    };
  }, []);

  // console.log(error, animationFrame.current);

  return (
    <s.ContainerStyle>
      <s.ContextContainerStyle>
        <DragDropContext onDragStart={onDragStart} onDragUpdate={onDragUpdate} onDragEnd={onDragEnd} >
          {
            state.entities.columns.map((column) => {
              // const inValid = error.error && error.target === column;
              const inValid = false;

              return (
                <Column key={column} id={column} inValid={inValid}>
                  {
                    state.entities.columnItems[column].map((item, index) => {
                      const curItem = state.entities.items[item];
                      const isSelected = state.selected.ordered.includes(curItem.id);
                      const isExtra = state.dragging && isSelected && state.dragging !== curItem.id;
                      const isError = state.dragging && error.error && state.dragging === curItem.id;

                      return (
                        <Item
                          key={curItem.id}
                          item={curItem}
                          index={index}
                          isSelected={isSelected}
                          isExtra={isExtra}
                          isError={isError}
                          selectedCount={state.selected.ordered.length}
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