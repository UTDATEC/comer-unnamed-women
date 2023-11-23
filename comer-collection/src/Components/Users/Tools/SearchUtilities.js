export const searchItems = (searchQuery, itemsToSearch, fieldsToSearch) => {
  return itemsToSearch.filter((item) => {
    if(fieldsToSearch.length == 0)
      return true;
    for (let f of fieldsToSearch) {
      if (Boolean((item[f] ?? "").toLowerCase().includes(searchQuery.toLowerCase()))) {
        return true;
      }
    }
    return false;
  });
};
