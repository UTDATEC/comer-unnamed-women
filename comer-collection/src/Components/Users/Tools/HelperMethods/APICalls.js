import axios from "axios";
import { filterItemFields, userFieldDefinitions } from "./fields";

const apiLocation = "http://localhost:9000";

export const sendAuthenticatedRequest = async(method, url, payload) => {
  const axiosMethods = {
    "GET": axios.get,
    "POST": axios.post,
    "PUT": axios.put,
    "DELETE": axios.delete
  }
  
  if(!Object.keys(axiosMethods).includes(method))
    throw Error(`${method} is not a valid method`);

  switch (method) {
    case "GET":
    case "DELETE":
      const response = await axiosMethods[method](
        `${apiLocation}${url}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        }
      )
      return response.data;
  
    case "POST":
    case "PUT":
      const response2 = await axiosMethods[method](
        `${apiLocation}${url}`, payload, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        }
      )
      return response2.data;
  }


}


export const createUsers = async(newUserArray, {showSnackbar, setCreateDialogIsOpen, createDialogDispatch, fetchData}) => {
  let usersCreated = 0;
  let userIndicesWithErrors = []
  for(const [i, newUserData] of newUserArray.entries()) {
    try {
      let filteredUser = filterItemFields(userFieldDefinitions, newUserData)
      await sendAuthenticatedRequest("POST", "/api/users", filteredUser)

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
      showSnackbar(`Created ${usersCreated} of ${newUserArray.length} ${newUserArray.length == 1 ? "user" : "users"}.  Make sure each user has a unique email address.`, "warning");
    }
    else {
      showSnackbar(`Failed to create ${newUserArray.length} ${newUserArray.length == 1 ? "user" : "users"}.  Make sure each user has a unique email address.`, "error")
    }

    createDialogDispatch({
      type: "set",
      newArray: newUserArray.filter((u, i) => {
        return userIndicesWithErrors.includes(i);
      })
    })
  }

}