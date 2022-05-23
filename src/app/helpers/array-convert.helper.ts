export const convertStringToSelectItem = (
  stringHotline: string,
  separate = ';'
) => {
  return stringHotline
    .split(separate)
    .map((item) => ({ label: item, value: item }));
};
