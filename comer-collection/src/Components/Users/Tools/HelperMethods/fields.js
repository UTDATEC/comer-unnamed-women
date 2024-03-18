export const getBlankItemFields = (fields) => {
    const output = {};
    for (let f of fields) {
        output[f.fieldName] = f.blank ?? "";
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
export const userFieldDefinitions = [
    {
        fieldName: "given_name",
        displayName: "First Name"
    },
    {
        fieldName: "family_name",
        displayName: "Last Name"
    },
    {
        fieldName: "email",
        displayName: "Email",
        isRequired: true,
        inputType: "email"
    },
    {
        fieldName: "exhibition_quota",
        displayName: "Exhibition Quota",
        isRequired: true,
        inputType: "number",
        blank: 5,
        minValue: 0
    }
];
export const courseFieldDefinitions = [
    {
        fieldName: "name",
        displayName: "Course Name",
        inputType: "textarea",
        isRequired: true
    },
    {
        fieldName: "date_start",
        displayName: "Start",
        inputType: "datetime-local",
        isRequired: true
    },
    {
        fieldName: "date_end",
        displayName: "End",
        inputType: "datetime-local",
        isRequired: true
    },
    {
        fieldName: "notes",
        displayName: "Notes",
        inputType: "textarea",
        multiline: true
    }
];
export const imageFieldDefinitions = [
    {
        fieldName: "title",
        displayName: "Image Title",
        isRequired: true
    },
    {
        fieldName: "accessionNumber",
        displayName: "Accession Number",
        isRequired: false
    },
    {
        fieldName: "year",
        displayName: "Year",
        isRequired: false,
        inputType: "number"
    },
    {
        fieldName: "additionalPrintYear",
        displayName: "Additional Print Year",
        isRequired: false,
        inputType: "number"
    },
    {
        fieldName: "url",
        displayName: "URL",
        inputType: "url",
        multiline: true,
        blank: "https://atecquilt01.utdallas.edu/comer/public/images/"
    },
    {
        fieldName: "thumbnailUrl",
        displayName: "Thumbnail URL",
        inputType: "url",
        multiline: true,
        blank: "https://atecquilt01.utdallas.edu/comer/public/images/"
    },
    {
        fieldName: "medium",
        displayName: "Medium",
        isRequired: false
    },
    {
        fieldName: "width",
        displayName: "Image Width",
        isRequired: true,
        inputType: "number"
    },
    {
        fieldName: "height",
        displayName: "Image Height",
        isRequired: true,
        inputType: "number"
    },
    {
        fieldName: "matWidth",
        displayName: "Mat Width",
        inputType: "number"
    },
    {
        fieldName: "matHeight",
        displayName: "Mat Height",
        inputType: "number"
    },
    {
        fieldName: "copyright",
        displayName: "Copyright",
        inputType: "textarea",
        multiline: true
    },
    {
        fieldName: "location",
        displayName: "Location",
        isRequired: false
    },
    {
        fieldName: "subject",
        displayName: "Subject",
        inputType: "textarea",
        multiline: true
    },
    {
        fieldName: "condition",
        displayName: "Condition",
        inputType: "textarea"
    },
    {
        fieldName: "valuationNotes",
        displayName: "Valuation Notes",
        inputType: "textarea",
        multiline: true
    },
    {
        fieldName: "otherNotes",
        displayName: "Other Notes",
        inputType: "textarea",
        multiline: true
    }
];
export const artistFieldDefinitions = [
    {
        fieldName: "familyName",
        displayName: "Last Name",
        isRequired: true
    },
    {
        fieldName: "givenName",
        displayName: "First Name",
        isRequired: true
    },
    {
        fieldName: "website",
        displayName: "Website",
        isRequired: false,
        inputType: "url"
    },
    {
        fieldName: "notes",
        displayName: "Notes",
        isRequired: false,
        inputType: "textarea",
        multiline: true,
        blank: ""
    }
];


export const tagFieldDefinitions = [
    {
        fieldName: "data",
        displayName: "Tag",
        isRequired: true
    },
    {
        fieldName: "notes",
        displayName: "Notes",
        isRequired: false,
        inputType: "textarea",
        multiline: true
    }
];
