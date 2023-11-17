import React from "react";
import { List, ListItem, ListItemIcon, ListItemText, Typography, Stack } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { AdminNavData } from "./AdminNavData";

function AdminNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleItemClick = (link) => {
    navigate(link);
  };

  return (
    <Stack direction="column">
        <List
          sx={{ backgroundColor: "#E87500", height: "100%", color: "white" }}
        >
          <ListItem>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
                paddingTop: "10%",
                paddingBottom: "5%",
              }}
            >
              <Typography variant="h4" style={{ fontWeight: "bold" }}>
                Admin
              </Typography>
            </div>
          </ListItem>
          {AdminNavData.map((item) => (
            <ListItem
              key={item.title}
              button
              selected={location.pathname === item.link}
              onClick={() => handleItemClick(item.link)}
              sx={{
                backgroundColor:
                  location.pathname === item.link
                    ? "#1B5E20 !important"
                    : "inherit",
                "&:hover": {
                  backgroundColor: "#1B5E20 !important",
                },
              }}
            >
              <ListItemIcon sx={{ color: "white" }}>{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.title}
                sx={{
                  textDecoration:
                    location.pathname === item.link ? "underline" : "none",
                }}
              />
            </ListItem>
          ))}
        </List>
      </Stack>
  );
}

export default AdminNav;
