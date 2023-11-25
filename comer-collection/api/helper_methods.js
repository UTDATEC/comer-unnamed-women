const convertEmptyFieldsToNullFields = (object) => {
    const output = {}
    for(let [field, value] of Object.entries(object)) {
        if (value !== "")
            output[field] = value;
        else
            output[field] = null;
    }
    return output;
}

module.exports = { convertEmptyFieldsToNullFields }