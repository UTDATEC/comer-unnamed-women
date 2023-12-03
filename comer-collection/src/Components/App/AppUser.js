import React, { createContext, useContext, useEffect, useState } from 'react';


export const AppUserContext = createContext();

export const AppUserProvider = ({ children }) => {

  
  const [appUser, setAppUser] = useState(null);

  
  useEffect(() => {
    const initializeAppUser = async() => {
      try {
        const response = await fetch("http://localhost:9000/api/account/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        if(response.status == 200) {
          let responseJson = await response.json();
          setAppUser(responseJson.data);
        } else {
          throw new Error("Response status was not 200")
        }
      } catch (error) {
        setAppUser(null);
      }
      
    }
    initializeAppUser();
  }, []);

  
  return (
    <AppUserContext.Provider value={{ appUser, setAppUser }}>
      {children}
    </AppUserContext.Provider>
  );
};

export const useAppUser = () => {
  const { appUser, setAppUser } = useContext(AppUserContext);
  return [appUser, setAppUser];
};
