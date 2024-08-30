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

// 선택 관련 정보를 담은 객체 초기화
export const initSelected = () => {
  return {
    list: [],
    ordered: [],
    columns: [],
  };
}

// 아이템으로 컬럼 아이디 찾기
const getColumnIdFromItem = (entities, id) => {
  const columnId = entities.columns.find(ci => {
    const columnItems = entities.columnItems[ci];

    return columnItems.includes(id);
  });

  return columnId;
}

// 선택된 아이템들을 화면상의 순서에 맞게 정렬
const getOrderedSelectedItems = (entities, selected) => {
  const updated = entities.columns.reduce((prev, cur) => {
    const column = entities.columnItems[cur];

    prev.push(...column.filter(item => selected.includes(item)));

    return prev;
  }, []);

  return updated;
}

// 선택 관련 정보 업데이트
const updateSelectedInfo = (entities, list) => {
  return {
    list: list,
    ordered: getOrderedSelectedItems(entities, list),
    columns: Array.from(new Set(list.map(item => getColumnIdFromItem(entities, item))))
  }
}

// 클릭 시 선택된 아이템 업데이트
const updateSelectClick = ({
  entities,
  selected,
  id
}) => {
  const list = selected.list;
  const wasSelected = list.includes(id);

  const udpated = (() => {
    if (!wasSelected || list.length > 1) {
      const updatedList = [id];

      return updateSelectedInfo(entities, updatedList);
    }

    return initSelected();
  })();

  return udpated;
}

// 컨트롤 + 클릭 시 선택된 아이템 업데이트
const updateSelectCtrl = ({
  entities,
  selected,
  id
}) => {
  const list = selected.list;
  const index = list.indexOf(id);

  const updated = (() => {
    if (index === -1) {
      const updatedList = [...list, id];

      return updateSelectedInfo(entities, updatedList);
    } else {
      list.splice(index, 1);

      return updateSelectedInfo(entities, list);
    }
  })();

  return updated;
}
// 쉬프트 + 클릭 시 선택된 아이템 업데이트
const updateSelectShift = ({
  entities,
  selected,
  id
}) => {
  if (!selected.list.length) {
    const updatedList = [id];

    return updateSelectedInfo(entities, updatedList);
  }

  const columnTo = entities.columnItems[getColumnIdFromItem(entities, id)];
  const indexTo = columnTo.indexOf(id);

  const lastSelected = selected.list[selected.list.length - 1];
  const columnFrom = entities.columnItems[getColumnIdFromItem(entities, lastSelected)];
  const indexFrom = columnFrom.indexOf(lastSelected);

  if (columnFrom !== columnTo) {
    const updatedList = columnTo.slice(indexTo, indexTo + 1);

    return updateSelectedInfo(entities, updatedList);
  }

  if (indexFrom === indexTo) {
    const updatedList = [id];

    return updateSelectedInfo(entities, updatedList);
  }

  const direction = indexTo > indexFrom;
  const start = direction ? indexFrom : indexTo;
  const end = direction ? indexTo : indexFrom;

  const between = columnTo.slice(start, end + 1);
  const newSelectedList = [...selected.list.filter(s => !between.includes(s)), ...(direction ? between : between.reverse())];

  return updateSelectedInfo(entities, newSelectedList);
}

// 선택된 아이템 업데이트
export const updateSelected = (type, entities, selected, id) => {
  const update = {
    'click': updateSelectClick,
    'ctrl': updateSelectCtrl,
    'shift': updateSelectShift,
  }

  return update[type]({ selected, id, entities });
}

// 아이템 재정렬
export const reorder = (entities, selected, dragging, source, destination) => {
  const itemsSelected = selected.ordered;

  // 삽입할 컬럼의 인덱스 계산
  const indexInsert = (() => {
    const indexOffset = entities.columnItems[destination.droppableId].reduce(
      (prev, cur, idx) => {
        if (idx > destination.index) {
          return prev;
        }

        if (cur === dragging) {
          return prev;
        }

        if (!itemsSelected.includes(cur)) {
          return prev;
        }

        return prev + 1;
      }, 0
    );

    return destination.index - indexOffset;
  })();

  // 선택된 항목을 제외하고 남아있는 컬럼의 아이템들 계산
  const updated = entities.columns.reduce((prev, cur) => {
    const column = entities.columnItems[cur];
    const remain = column.filter(item => !itemsSelected.includes(item));

    prev[cur] = remain;

    return prev;
  }, {});

  // 선택한 아이템 삽입
  updated[destination.droppableId].splice(indexInsert, 0, ...itemsSelected);

  return {
    entities: {
      ...entities,
      columnItems: updated
    },
    selected,
  };
};