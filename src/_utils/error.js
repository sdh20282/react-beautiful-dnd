// 에러 정보 초기화
export const initError = () => {
  return {
    error: false,
    message: '',
    target: null,
    type: null,
  }
}

// 1번째 컬럼에서 3번째 컬럼으로 이동하는 경우 확인
export const checkColumnException = ({
  selectedColumns,
  update
}) => {
  if (selectedColumns.includes('column-1') && update.destination?.droppableId === 'column-3') {
    return true;
  }

  return false;
}

// 짝수 아이템이 다른 짝수 아이템에 위치하는지 확인
export const checkEvenItemException = ({
  items,
  targetList,
  selectedList,
  lastItem,
  index,
  dragging
}) => {
  let flag = false;

  // 마지막 아이템과의 비교 대상 아이템 계산
  const compare = targetList.find(
    (item, idx) => {
      if (item === dragging) {
        flag = true;

        return false;
      }

      if (selectedList.includes(item)) {
        return false;
      }

      if (idx < index + (flag ? 1 : 0)) {
        return false;
      }

      return true;
    }, 0
  );

  // 마지막 아이템과 비교 대상 아이템이 짝수 아이템인지 확인
  if (compare && items[compare].even && items[lastItem].even) {
    return true;
  }

  return false;
}