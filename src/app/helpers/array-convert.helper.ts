export const convertHotlineVirtual = (stringHotline: string) => {
  return stringHotline.split(',').map((item) => ({ label: item, value: item }));
};
