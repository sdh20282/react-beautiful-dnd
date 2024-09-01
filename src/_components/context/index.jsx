import { useState, useCallback, useEffect, useRef } from "react";

import { DragDropContext } from "react-beautiful-dnd";

import { Column, Item } from "@components";
import { getEntities, initSelected, initError, updateSelected, reorder, windowEventHandler, checkColumnException, checkEvenItemException } from "@utils";
import { COLUMN_COUNT, ITEM_COUNT, ITEM_HEIGHT } from "@data";

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
  const error = useRef(initError());
  const drag = useRef(false);
  const animationFrame = useRef(null);
  const mouseY = useRef(0);

  // 강제 리렌더링을 위한 state
  const [_, setRender] = useState(false);

  const rerender = useCallback(() => {
    setRender(s => !s);
  }, []);

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
    error.current = initError();

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
    if (checkColumnException({
      selectedColumns: state.selected.columns,
      update
    })) {
      error.current = {
        error: true,
        message: '첫번째 열의 아이템은 세번째 열로 이동할 수 없습니다.',
        target: update.destination.droppableId,
        type: 'column',
      };

      rerender();

      return;
    }

    // 마지막 짝수 아이템이 다른 짝수 아이템 앞으로 오는 경우
    if (checkEvenItemException({
      items: state.entities.items,
      targetList: state.entities.columnItems[update.destination.droppableId],
      selectedList: state.selected.list,
      lastItem: state.selected.ordered[state.selected.ordered.length - 1],
      index: update.destination.index,
      dragging: state.dragging
    })) {
      error.current = {
        error: true,
        message: '짝수 아이템은 다른 짝수 아이템 앞으로 올 수 없습니다.',
        target: update.destination.droppableId,
        type: 'item',
      };

      rerender();

      return;
    }

    if (error.current.error) {
      error.current = initError();

      rerender();
    }
  }

  // 드래그 종료 시
  const onDragEnd = useCallback((end) => {
    drag.current = false;

    // destination이 column이 아니거나 cancel, error시 드래그 중인 아이템 초기화
    if (!end.destination || end.reason === 'CANCEL' || error.current.error) {
      error.current = initError();

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

  // 멀티 드래그 해제를 위해 window 객체에 관련 이벤트 핸들러 등록
  useEffect(() => {
    const windowEvents = Object.keys(windowEventHandler);
    const eventHandlers = windowEvents.reduce((acc, cur) => {
      const current = {
        ...acc,
        [cur]: (event) => {
          windowEventHandler[cur](event, () => {
            error.current = initError();

            unSelectAll();
          })
        },
      };

      return current;
    }, {});

    // 강제 리렌더링을 통한 에러 재검사
    const revalidateError = (event) => {
      if (!drag.current) {
        return;
      }

      if (animationFrame.current) {
        return;
      }

      if (!error.current.error || error.current.type !== 'item') {
        return;
      }

      if (Math.abs(mouseY.current - event.clientY) < ITEM_HEIGHT / 2) {
        return;
      }

      animationFrame.current = requestAnimationFrame(() => {
        error.current = initError();
        animationFrame.current = null;
        mouseY.current = event.clientY;

        rerender();
      });
    };

    windowEvents.forEach(e => {
      window.addEventListener(e, eventHandlers[e]);
    });

    window.addEventListener('mousemove', revalidateError);

    return () => {
      windowEvents.forEach(e => {
        window.removeEventListener(e, eventHandlers[e]);
      });

      window.removeEventListener('mousemove', revalidateError);
    };
  }, []);

  return (
    <s.ContainerStyle>
      <s.ContextContainerStyle>
        <DragDropContext onDragStart={onDragStart} onDragUpdate={onDragUpdate} onDragEnd={onDragEnd} >
          {
            state.entities.columns.map((column) => {
              const inValid = error.current.error && error.current.target === column;
              // const inValid = false;

              return (
                <Column key={column} id={column} inValid={inValid}>
                  {
                    state.entities.columnItems[column].map((item, index) => {
                      const curItem = state.entities.items[item];
                      const isSelected = state.selected.ordered.includes(curItem.id);
                      const isExtra = state.dragging && isSelected && state.dragging !== curItem.id;
                      const isError = state.dragging && error.current.error && state.dragging === curItem.id;

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