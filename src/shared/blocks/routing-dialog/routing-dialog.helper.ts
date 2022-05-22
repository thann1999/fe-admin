export const convertHotline = (stringHotline: string) => {
  return stringHotline.split(',').map((item) => ({ label: item, value: item }));
};
