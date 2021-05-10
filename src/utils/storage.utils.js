export const getItemLocalStorage = (key) =>
  window.localStorage.getItem(key) || '';

export const setItemLocalStorage = (key, value) => {
  window.localStorage.setItem(key, value);
};
