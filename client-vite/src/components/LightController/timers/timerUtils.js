export const MAX_LEVEL = 10000;

export const includes = (arr1, arr2) =>
  arr2.every((item) => arr1.includes(item));

export const minutesToDate = (minutes) => {
  const date = new Date();
  date.setHours(Math.floor(minutes / 60));
  date.setMinutes(minutes % 60);
  return date;
};

export const dateToMinutes = (date) => date.getHours() * 60 + date.getMinutes();
