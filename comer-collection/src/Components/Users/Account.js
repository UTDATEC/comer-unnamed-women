import React, { createContext, useContext, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom"; // Import Route from react-router-dom
import AdminNav from "./AccountNav";
import UserManagement from "./Admin/UserManagement";
import ImageManagement from "./Admin/ImageManagement";
import Profile from "./Profile";
import { Box } from "@mui/material";
import Unauthorized from "../ErrorPages/Unauthorized";
import ChangePassword from "./ChangePassword";
import CourseManagement from "./Admin/CourseManagement";
import MyExhibitions from "./MyExhibitions";
import ExhibitionManagement from "./Admin/ExhibitionManagement";
import { useAppUser } from "../App/AppUser";
import { LockIcon } from "../IconImports";


const AccountNavContext = createContext();


const Account = () => {

    const [appUser] = useAppUser();

    const [selectedNavItem, setSelectedNavItem] = useState("");

    return appUser && (
        <AccountNavContext.Provider value={{selectedNavItem, setSelectedNavItem}}>

            <Box sx={{
                display: "grid",
                gridTemplateColumns: "250px auto",
                gridTemplateAreas: `
          "sidebar main"
        `,
                height: "100%"
            }}>


                <AdminNav sx={{gridArea: "sidebar"}} />
        
                <Box sx={{gridArea: "main", position: "relative", overflowY: "hidden", height: "100%"}}>
          
                    <Routes>
                        <Route index element={
                            !appUser.pw_change_required && (<Navigate to='Profile' replace />) ||
              appUser.pw_change_required && (<Navigate to='ChangePassword' replace />)
                        } />
                        <Route path="Profile" element={<Profile />} />
                        <Route path="ChangePassword" element={<ChangePassword />} />
                        <Route path="MyExhibitions" element={<MyExhibitions />} />
                        <Route path="UserManagement" element={<UserManagement />} />
                        <Route path="ExhibitionManagement" element={<ExhibitionManagement />} />
                        <Route path="ImageManagement" element={<ImageManagement />} />
                        <Route path="CourseManagement" element={<CourseManagement />} />

                    </Routes>

                </Box>
      
            </Box>
        </AccountNavContext.Provider>
    ) || !appUser && (
        <Unauthorized Icon={LockIcon} message="Unauthorized" buttonDestination="/login" buttonText="Return to Login" />
    );
};

export const useAccountNav = () => {
    const { selectedNavItem, setSelectedNavItem } = useContext(AccountNavContext);
    return [selectedNavItem, setSelectedNavItem];
};

export default Account;
