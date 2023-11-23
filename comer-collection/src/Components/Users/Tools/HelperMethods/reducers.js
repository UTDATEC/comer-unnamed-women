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
};export const createImageDialogReducer = (createDialogImages, action) => {
  switch (action.type) {
    case 'add':
      return [...createDialogImages, {
        name: "",
        date_start: "",
        date_end: "",
        notes: ""
      }];

    case 'change':
      return createDialogImages.map((r, i) => {
        if (action.index == i)
          return { ...r, [action.field]: action.newValue };

        else
          return r;
      });

    case 'remove':
      return createDialogImages.filter((r, i) => {
        return action.index != i;
      });

    case 'set':
      return action.newArray;

    default:
      throw Error("Unknown action type");
  }
};
export const createCourseDialogReducer = (createDialogCourses, action) => {
  switch (action.type) {
    case 'add':
      return [...createDialogCourses, {
        name: "",
        date_start: "",
        date_end: "",
        notes: ""
      }];

    case 'change':
      return createDialogCourses.map((r, i) => {
        if (action.index == i)
          return { ...r, [action.field]: action.newValue };

        else
          return r;
      });

    case 'remove':
      return createDialogCourses.filter((r, i) => {
        return action.index != i;
      });

    case 'set':
      return action.newArray;

    default:
      throw Error("Unknown action type");
  }
};

