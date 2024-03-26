import axios from "axios";

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
