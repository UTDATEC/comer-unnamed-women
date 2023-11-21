export const searchItems = (searchQuery, itemsToSearch, fieldsToSearch) => {
  return itemsToSearch.filter((item) => {
    for (let f of fieldsToSearch) {
      if (Boolean((item[f] ?? "").toLowerCase().includes(searchQuery.toLowerCase()))) {
        return true;
      }
    }
    return false;
  });
};
