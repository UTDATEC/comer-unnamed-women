import axios from "axios";
import { filterItemFields, userFieldDefinitions } from "./fields";

export const createUsers = async(newUserArray, {showSnackbar, setCreateDialogIsOpen, createDialogDispatch, fetchData}) => {
  let usersCreated = 0;
  let userIndicesWithErrors = []
  for(const [i, newUserData] of newUserArray.entries()) {
    try {
      let filteredUser = filterItemFields(userFieldDefinitions, newUserData)
      await axios.post(
        `http://localhost:9000/api/users`, filteredUser,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      usersCreated++;

    } catch (error) {
      console.error(`Error creating user ${JSON.stringify(newUserData)}: ${error}`);
      userIndicesWithErrors.push(i);
    }
  }
  fetchData();

  if(usersCreated == newUserArray.length) {
    setCreateDialogIsOpen(false);
    createDialogDispatch({
      type: "set",
      newArray: []
    })

    showSnackbar(`Successfully created ${newUserArray.length} ${newUserArray.length == 1 ? "user" : "users"}`, "success");

  } else if(usersCreated < newUserArray.length) {

    if(usersCreated > 0) {
      showSnackbar(`Created ${usersCreated} of ${newUserArray.length} ${newUserArray.length == 1 ? "user" : "users"}.  Make sure the email addresses are unique, and try again.`, "warning");
    }
    else {
      showSnackbar(`Failed to create ${newUserArray.length} ${newUserArray.length == 1 ? "user" : "users"}.  
        ${newUserArray.length == 1 ? 
          "Make sure the email address is not already in use, and try again." : 
          "Make sure the email address is not already in use, and try again."}`, "error")
    }

    createDialogDispatch({
      type: "set",
      newArray: newUserArray.filter((u, i) => {
        return userIndicesWithErrors.includes(i);
      })
    })
  }

}