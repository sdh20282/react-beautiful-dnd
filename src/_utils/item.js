export const getItems = (count) => {
  const items = Array.from({ length: count }, (_, k) => k).map((k) => ({
    id: `item-${k}`,
    content: `item ${k}`,
  }));

  return items;
};

export const removeItem = (list, index) => {
  const result = Array.from(list);
  const [removed] = result.splice(index, 1);

  return {
    arr: result,
    item: removed,
  }
}

export const insertItem = (list, item, index) => {
  const result = Array.from(list);
  result.splice(index, 0, item);

  return result;
}