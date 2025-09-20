export const filterByKeySearch = <T>(
  items: T[],
  key: keyof T,
  searchValue?: string
): T[] => {
  if (!searchValue) return items;

  return items.filter((item) =>
    String(item[key])?.toLowerCase().includes(searchValue.toLowerCase())
  );
};

export const filterByKeyEquals = <T>(
  items: T[],
  key: keyof T,
  value?: string | number
): T[] => {
  if (!value) return items;

  return items?.filter((item) => String(item[key]) == value);
};

export const filterByKeyLess = <T>(
  items: T[],
  key: keyof T,
  value?: string | number
): T[] => {
  if (!value) return items;

  return items?.filter((item) => String(item[key]) <= value);
};

export const filterByKeyMore = <T>(
  items: T[],
  key: keyof T,
  value?: string | number
): T[] => {
  if (!value) return items;

  return items?.filter((item) => String(item[key]) >= value);
};
