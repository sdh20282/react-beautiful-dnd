import { useState, useCallback, useEffect, useRef } from "react";

import { DragDropContext } from "react-beautiful-dnd";

import { Column, Item, Delete, Setting } from "@components";
import { getEntities, initSelected, initError, updateSelected, reorder, windowEventHandler, checkColumnException, checkEvenItemException, addColumn, removeColumn, addItem, deleteItem } from "@utils";
import { COLUMN_COUNT, ITEM_COUNT, ITEM_HEIGHT } from "@data";

import * as s from './styles';

const validateY = (ITEM_HEIGHT * 2) / 5;

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

  // 기타 처리를 위한 정보
  const drag = useRef(false);
  const animationFrame = useRef(null);
  const mouseY = useRef(0);

  // 설정 타입
  const [settingType, setSettingType] = useState('');

  // 강제 리렌더링을 위한 state
  const [_, setRender] = useState(false);

  // 강제 리렌더 함수
  const rerender = useCallback(() => {
    setRender(s => !s);
  }, []);

  // 선택된 아이템 전부 제거
  const unSelectAll = useCallback(() => {
    setState(s => ({
      ...s,
      selected: initSelected(),
    }));
  }, [state]);

  // 컬럼 추가를 위한 함수
  const onClickAddColumn = useCallback(() => {
    // 엔티티 정보 갱신
    const updatedColumn = addColumn({ entities: state.entities, number: info.columns });

    // 반영
    setState(s => ({
      ...s,
      entities: updatedColumn
    }));

    setInfo(s => ({
      ...s,
      columns: s.columns + 1
    }));
  }, [info, state]);

  // 컬럼 삭제를 위한 함수
  const onClickRemoveColumn = useCallback(() => {
    // 엔티티 정보 갱신
    const {
      updatedEntities,
      updatedSelected
    } = removeColumn({
      entities: state.entities,
      selected: state.selected,
      lastColumn: `column-${info.columns}`,
      prevColumn: `column-${info.columns - 1}`,
    });

    // 반영
    setState(s => ({
      ...s,
      entities: updatedEntities,
      selected: updatedSelected,
    }));

    setInfo(s => ({
      ...s,
      columns: s.columns - 1
    }));
  }, [info, state]);

  // 아이템 추가를 위한 함수
  const onClickAddItem = useCallback(() => {
    // 엔티티 정보 갱신
    const updatedEntities = addItem({
      entities: state.entities,
      number: info.items,
    });

    // 반영
    setState(s => ({
      ...s,
      entities: updatedEntities
    }));

    setInfo(s => ({
      ...s,
      items: s.items + 1,
    }))
  }, [info, state]);

  // 아이템 삭제를 위한 함수
  const onClickDeleteItem = useCallback(() => {
    // 선택된 아이템이 없을 경우 예외 처리
    if (state.selected.list.length === 0) {
      return;
    }

    // 새로운 엔티티 정보 갱신
    const updatedEntities = deleteItem({
      entities: state.entities,
      selectedList: state.selected.list,
    });

    // 반영
    setState(s => ({
      ...s,
      entities: updatedEntities,
      selected: initSelected(),
      dragging: null,
    }));
  }, [info, state]);

  // 드래그 시작 시
  const onDragStart = useCallback((start) => {
    // 잘못된 위치에서 드래그 시작 시 예외 처리
    if (!start.source) {
      return;
    }

    // drag, error 정보 갱신
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
  const onDragUpdate = useCallback((update) => {
    // 잘못된 위치에서 업데이트될 경우 예외 처리
    if (!update.destination) {
      return;
    }

    // delete Droppable 처리
    if (update.destination.droppableId === 'delete') {
      error.current = initError();

      rerender();

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
        message: '짝수 아이템은 다른 짝수 아이템 바로 앞으로 올 수 없습니다.',
        target: update.destination.droppableId,
        type: 'item',
      };

      rerender();

      return;
    }

    // udpate는 발생했지만 에러가 발생하지 않을 경우
    if (error.current.error) {
      // 에러 정보 갱신
      error.current = initError();

      rerender();
    }
  }, [state, error]);

  // 드래그 종료 시
  const onDragEnd = useCallback((end) => {
    // drag 정보 갱신
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

    // delete 영역으로 드래그 시
    if (end.destination.droppableId === 'delete') {
      if (state.selected.list.length === 0) {
        return;
      }

      // 아이템 제거
      const updatedEntities = deleteItem({
        entities: state.entities,
        selectedList: state.selected.list,
      });

      setState(s => ({
        ...s,
        entities: updatedEntities,
        selected: initSelected(),
        dragging: null,
      }));
      // 컬럼 영역으로 드래그 시
    } else {
      // 새로운 state 생성
      const updatedState = reorder({
        entities: state.entities,
        selected: state.selected,
        dragging: state.dragging,
        destination: end.destination
      });

      // 업데이트
      setState(s => ({
        ...s,
        ...updatedState,
        dragging: null,
      }));
    }
  }, [state, error]);

  // 아이템 선택
  const changeSelect = useCallback((type, id) => {
    const updated = updateSelected({
      type,
      entities: state.entities,
      selected: state.selected,
      id,
    });

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

    // 강제 리렌더링을 통한 에러 재검사 함수
    const revalidateError = (event) => {
      if (!drag.current) {
        return;
      }

      if (animationFrame.current) {
        return;
      }

      // 아이템 위치 에러일 경우만 계산
      if (!error.current.error || error.current.type !== 'item') {
        return;
      }

      // 마우스가 일정 범위 이하로 움직였을 경우 계산하지 않음
      if (Math.abs(mouseY.current - event.clientY) < validateY) {
        return;
      }

      // 강제 리렌더링을 통한 에러 검사
      animationFrame.current = requestAnimationFrame(() => {
        error.current = initError();
        animationFrame.current = null;
        // 마우스 위치 갱신
        mouseY.current = event.clientY;

        rerender();
      });
    };

    // 윈도우에 이벤트 핸들러 등록
    windowEvents.forEach(e => {
      window.addEventListener(e, eventHandlers[e]);
    });

    window.addEventListener('mousemove', revalidateError);

    // 윈도우에서 이벤트 핸들러 해제
    return () => {
      windowEvents.forEach(e => {
        window.removeEventListener(e, eventHandlers[e]);
      });

      window.removeEventListener('mousemove', revalidateError);
    };
  }, []);

  return (
    <s.ContainerStyle>
      <s.SettingContainerStyle>
        <header>
          <h2>setting section</h2>
        </header>
        <Setting
          description='columns'
          addTitle='Add Column'
          removeTitle='Remove Column'
          addCallback={onClickAddColumn}
          removeCallback={onClickRemoveColumn}
          type='column'
          settingType={settingType}
          setType={setSettingType}
          disableAdd={info.columns === 6}
          disableRemove={info.columns === 1}
        />
        <Setting
          description='items'
          addTitle='Add Item'
          removeTitle='Remove Selected Items'
          addCallback={onClickAddItem}
          removeCallback={onClickDeleteItem}
          type='item'
          settingType={settingType}
          setType={setSettingType}
          disableRemove={state.selected.list.length === 0}
        />
      </s.SettingContainerStyle>
      <s.ContextContainerStyle>
        <header>
          <h2>drag & drop section</h2>
        </header>
        <DragDropContext onDragStart={onDragStart} onDragUpdate={onDragUpdate} onDragEnd={onDragEnd} >
          <s.ColumnListStyle>
            {
              state.entities.columns.map((column) => {
                // 해당 컬럼이 valid한지 계산
                const inValid = error.current.error && error.current.target === column;

                return (
                  <Column key={column} id={column} inValid={inValid}>
                    {
                      state.entities.columnItems[column].map((item, index) => {
                        const curItem = state.entities.items[item];
                        // 현재 선택된 아이템인지
                        const isSelected = state.selected.ordered.includes(curItem.id);
                        // 선택된 아이템이지만 드래그 대상이 아닌지
                        const isExtra = state.dragging && isSelected && state.dragging !== curItem.id;
                        // 에러의 대상인지
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
          </s.ColumnListStyle>
          <Delete key={'delete'} id={'delete'} />
        </DragDropContext>
        {
          // 에러 메시지가 있을 경우에만 출력
          error.current.message &&
          <s.ErrorMessageStyle>{error.current.message}</s.ErrorMessageStyle>
        }
      </s.ContextContainerStyle>
    </s.ContainerStyle>
  )
}

export { Context };