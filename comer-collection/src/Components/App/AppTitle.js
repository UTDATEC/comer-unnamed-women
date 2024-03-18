import React, { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";

let defaultSuffix = "Comer Collection";
const TitleContext = createContext();

export const TitleProvider = ({ children }) => {

    const [titleText, setTitleText] = useState(null);
    if(!titleText) {
        document.title = defaultSuffix;
    } else {
        document.title = `${titleText} - ${defaultSuffix}`;
    }

    return (
        <TitleContext.Provider value={setTitleText}>
            {children}
        </TitleContext.Provider>
    );
    
};

TitleProvider.propTypes = {
    children: PropTypes.node
};

export const useTitle = () => {
    const setTitleText = useContext(TitleContext);
    return setTitleText;
};
