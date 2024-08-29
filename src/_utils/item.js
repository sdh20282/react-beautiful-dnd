// 아이템 생성 함수
const getItems = (count) => {
  const items = Array.from({ length: count }, (_, k) => k).reduce((prev, _, idx) => {
    const current = {
      ...prev,
      [`item-${idx}`]: {
        id: `item-${idx}`,
        content: `item ${idx}`,
      }
    }

    return current;
  }, {});

  return items;
};

// 컬럼 생성 함수
const getColumns = (count) => {
  const columns = Array.from({ length: count }, (_, k) => `column-${k + 1}`);

  return columns;
}

// 엔티티 생성 함수
export const getEntities = (columnCount, itemCount) => {
  const items = getItems(itemCount);
  const columns = getColumns(columnCount);
  const columnItems = columns.reduce((prev, cur, idx) => {
    const current = {
      ...prev,
      [cur]: idx === 0 ? Object.keys(items).map(item => item) : [],
    };

    return current;
  }, {});

  return {
    items,
    columns,
    columnItems,
  };
}

// 클릭 시 선택된 아이템 업데이트
const updateSelectClick = (selected, id) => {
  const selectedList = selected;
  const wasSelected = selectedList.includes(id);

  const newSelectedList = (() => {
    if (!wasSelected || selectedList.length > 1) {
      return [id];
    }

    return [];
  })();

  return newSelectedList;
}

// 컨트롤 + 클릭 시 선택된 아이템 업데이트
const updateSelectCtrl = (selected, id) => {
  const selectedList = selected;
  const index = selectedList.indexOf(id);

  if (index === -1) {
    return [...selectedList, id];
  }

  selectedList.splice(index, 1);

  return selectedList;
}

// 아이템으로 해당 컬럼 찾기
const columnFromItem = (entities, id) => {
  const columnId = entities.columns.find(ci => {
    const columnItems = entities.columnItems[ci];

    return columnItems.includes(id);
  });

  return entities.columnItems[columnId];
}

// 쉬프트 + 클릭 시 선택된 아이템 업데이트
const updateSelectShift = (selected, id, entities) => {
  if (!selected.length) {
    return [id];
  }

  const columnTo = columnFromItem(entities, id);
  const indexTo = columnTo.indexOf(id);

  const lastSelected = selected[selected.length - 1];
  const columnFrom = columnFromItem(entities, lastSelected);
  const indexFrom = columnFrom.indexOf(lastSelected);

  if (columnFrom !== columnTo) {
    return columnTo.slice(indexTo, indexTo + 1);
  }

  if (indexFrom === indexTo) {
    return [id];
  }

  const direction = indexTo > indexFrom;
  const start = direction ? indexFrom : indexTo;
  const end = direction ? indexTo : indexFrom;

  const between = columnTo.slice(start, end + 1);
  const newSelectedList = [...selected.filter(s => !between.includes(s)), ...between];

  return newSelectedList;
}

// 선택된 아이템 업데이트
export const updateSelected = (type, entities, selected, id) => {
  const update = {
    'click': updateSelectClick,
    'ctrl': updateSelectCtrl,
    'shift': updateSelectShift,
  }

  return update[type](selected, id, entities);
}

// 아이템 재정렬
export const reorder = (entities, selected, destination) => {
  // 움직일 아이템 리스트 생성
  // 순서 보존을 위해
  const itemsSelected = entities.columns.reduce((prev, cur) => {
    const column = entities.columnItems[cur];

    prev.push(...column.filter(item => selected.includes(item)));

    return prev;
  }, []);

  // 삽입할 컬럼의 인덱스 계산
  const indexInsert = (() => {
    const indexOffset = selected.reduce(
      (prev, cur) => {
        if (cur === itemsSelected[0]) {
          return prev;
        }

        const final = entities.columnItems[destination.droppableId];
        const column = columnFromItem(entities, cur);

        if (column !== final) {
          return prev;
        }

        const index = column.indexOf(cur);

        if (index >= destination.index) {
          return prev;
        }

        return prev + 1;
      },
      0,
    );

    return destination.index - indexOffset;
  })();

  // 선택된 항목을 제외하고 남아있는 컬럼의 아이템들 계산
  const update = entities.columns.reduce((prev, cur) => {
    const column = entities.columnItems[cur];
    const remain = column.filter(item => !itemsSelected.includes(item));

    prev[cur] = remain;

    return prev;
  }, {});

  // 선택한 아이템 삽입
  update[destination.droppableId].splice(indexInsert, 0, ...itemsSelected);

  return {
    entities: {
      ...entities,
      columnItems: update,
    },
    selected,
  };
};