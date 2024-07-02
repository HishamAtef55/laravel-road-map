// Used for search
const have = (value, searchValue) => {
  let newValue = value;
  if (!newValue && newValue !== 0) return false;
  if (typeof newValue === "number") newValue = `${value}`;
  return newValue.toString().includes(searchValue) || newValue.toLowerCase().toString().includes(searchValue);
};
