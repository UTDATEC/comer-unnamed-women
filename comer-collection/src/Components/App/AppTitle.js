import { createContext, useContext, useState } from "react";

let defaultSuffix = "Comer Collection";
const TitleContext = createContext();

export const TitleProvider = ({ children }) => {

    const [titleText, setTitleText] = useState(null);
    if(titleText == null) {
        document.title = defaultSuffix;
    } else {
        document.title = `${titleText} - ${defaultSuffix}`;
    }

    return (
        <TitleContext.Provider value={setTitleText}>
            {children}
        </TitleContext.Provider>
    )
    
}

export const useTitle = () => {
    const setTitleText = useContext(TitleContext);
    return setTitleText;
}
