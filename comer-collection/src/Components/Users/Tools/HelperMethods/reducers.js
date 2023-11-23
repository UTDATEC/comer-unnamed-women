export const createUserDialogReducer = (createDialogUsers, action) => {
  switch (action.type) {
    case 'add':
      return [...createDialogUsers, {
        family_name: "",
        given_name: "",
        email: ""
      }];

    case 'change':
      return createDialogUsers.map((r, i) => {
        if (action.index == i)
          return { ...r, [action.field]: action.newValue };

        else
          return r;
      });

    case 'remove':
      return createDialogUsers.filter((r, i) => {
        return action.index != i;
      });

    case 'set':
      return action.newArray;

    default:
      throw Error("Unknown action type");
  }
};
