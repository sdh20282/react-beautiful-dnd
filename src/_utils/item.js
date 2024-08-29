export const getItems = (count) => {
  const items = Array.from({ length: count }, (_, k) => k).map((k) => ({
    id: `item-${k}`,
    content: `item ${k}`,
  }));

  return items;
};

export const checkCondition = () => {

}

export const reorder = (items, from, fromIndex, to, toIndex) => {
  const result = {};

  for (const item of Object.keys(items)) {
    result[item] = [...items[item]];
  }

  const [removed] = result[from].splice(fromIndex, 1);

  result[to].splice(toIndex, 0, removed);

  return result;
};