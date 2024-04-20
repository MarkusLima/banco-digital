
export const getItemFromLocalStorage = (key: string) => {
  const item = localStorage.getItem(key)
  return item ? item : null;
}

export const setItemFromLocalStorage = (key: string, value: string) => {
    localStorage.setItem(key, value);
}

export const removeItemFromLocalStorage = (key: string) => {
  localStorage.removeItem(key);
}