export const initError = () => {
  return {
    error: false,
    message: '',
    target: null,
  }
}

export const checkColumnException = (selectedColumns, update) => {
  if (selectedColumns.includes('column-1') && update.destination?.droppableId === 'column-3') {
    return true;
  }

  return false;
}

export const checkEvenItemException = (list, selected, target, index, dragging) => {
  let flag = false;

  const compare = list.find(
    (item, idx) => {
      if (item === dragging) {
        flag = true;

        return false;
      }

      if (selected.includes(item)) {
        return false;
      }

      if (idx < index + (flag ? 1 : 0)) {
        return false;
      }

      return true;
    }, 0
  );;

  if (compare && parseInt(compare.slice(-1)) % 2 === 0 && parseInt(target.slice(-1)) % 2 === 0) {
    return true;
  }

  return false;
}