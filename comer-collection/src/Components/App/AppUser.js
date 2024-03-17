import React, { createContext, useContext, useEffect, useState } from 'react';

export const AppUserContext = createContext();

export const AppUserProvider = ({ children }) => {

  
  const [appUser, setAppUser] = useState(null);

  const initializeAppUser = async() => {
    try {
      if(!localStorage.getItem('token')) {
        throw "No user is logged in"
      }
      const response = await fetch(`${process.env.REACT_APP_API_HOST}/api/user/profile`, {
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

  
  useEffect(() => {
    initializeAppUser();
  }, []);

  
  return (
    <AppUserContext.Provider value={{ appUser, setAppUser, initializeAppUser }}>
      {children}
    </AppUserContext.Provider>
  );
};

export const useAppUser = () => {
  const { appUser, setAppUser, initializeAppUser } = useContext(AppUserContext);
  return [appUser, setAppUser, initializeAppUser];
};
