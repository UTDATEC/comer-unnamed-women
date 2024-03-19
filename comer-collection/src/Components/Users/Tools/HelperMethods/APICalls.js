import axios from "axios";
import { filterItemFields, userFieldDefinitions } from "./fields";

const apiLocation = process.env.REACT_APP_API_HOST;

export const sendAuthenticatedRequest = async (method, url, payload) => {
    const axiosMethods = {
        "GET": axios.get,
        "POST": axios.post,
        "PUT": axios.put,
        "DELETE": axios.delete
    };

    const options = localStorage.getItem("token") ? {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
    } : {};

    try {
        if (!Object.keys(axiosMethods).includes(method))
            throw Error(`${method} is not a valid method`);

        switch (method) {
        case "GET":
        case "DELETE":
            if (Array.isArray(url)) {
                const responses = await Promise.all(url.map((endpoint) => axiosMethods[method](`${apiLocation}${endpoint}`, options)));
                return responses;
            } else {
                const response = await axiosMethods[method](
                    `${apiLocation}${url}`, localStorage.getItem("token") ? {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        }
                    } : {}
                );
                return { ...response.data, status: response.status };
            }

        case "POST":
        case "PUT":
            if (Array.isArray(url)) {
                const responses = await Promise.all(url.map((endpoint) => axiosMethods[method](`${apiLocation}${endpoint}`, payload, options)));
                return responses;
            } else {
                const response = await axiosMethods[method](
                    `${apiLocation}${url}`, payload, options
                );
                return { ...response.data, status: response.status };
            }
        }
    }
    catch (e) {
        throw new Error(e.message);
    }



};


export const createUsers = async (newUserArray, { showSnackbar, setDialogIsOpen, fetchData }) => {
    let usersCreated = 0;
    let userIndicesWithErrors = [];
    for (const [i, newUserData] of newUserArray.entries()) {
        try {
            let filteredUser = filterItemFields(userFieldDefinitions, newUserData);
            await sendAuthenticatedRequest("POST", "/api/admin/users", filteredUser);

            usersCreated++;

        } catch (error) {
            console.error(`Error creating user ${JSON.stringify(newUserData)}: ${error}`);
            userIndicesWithErrors.push(i);
        }
    }
    fetchData();

    if (usersCreated == newUserArray.length) {
        setDialogIsOpen(false);

        showSnackbar(`Successfully created ${newUserArray.length} ${newUserArray.length == 1 ? "user" : "users"}`, "success");

    } else if (usersCreated < newUserArray.length) {

        if (usersCreated > 0) {
            showSnackbar(`Created ${usersCreated} of ${newUserArray.length} ${newUserArray.length == 1 ? "user" : "users"}.  Make sure each user has a unique email address.`, "warning");
        }
        else {
            showSnackbar(`Failed to create ${newUserArray.length} ${newUserArray.length == 1 ? "user" : "users"}.  Make sure each user has a unique email address.`, "error");
        }
    }

    return userIndicesWithErrors;

};