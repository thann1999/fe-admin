export const convertStringToSelectItem = (stringHotline: string) => {
  return stringHotline
    .split(/[,;]/)
    .map((item) => ({ label: item, value: item }));
};
