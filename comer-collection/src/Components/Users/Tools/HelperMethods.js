export const getBlankItemFields = (fields) => {
  const output = {};
  for (let f of fields) {
    output[f.fieldName] = f.blank ?? '';
  }
  return output;
};

export const filterItemFields = (fields, unfilteredItem) => {
  const output = {};
  for (let f of fields) {
    output[f.fieldName] = unfilteredItem[f.fieldName];
  }
  return output;
};

