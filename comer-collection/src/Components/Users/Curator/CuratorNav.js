import React from "react";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Drawer,
  Toolbar,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { CuratorNavData } from "./CuratorNavData";

function CuratorNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleItemClick = (link) => {
    navigate(link);
  };

  return (
    <div style={{ display: "flex", position: "relative" }}>
      <Drawer variant="permanent" sx={{ zIndex: 0 }}>
        <Toolbar />
        <List
          sx={{
            backgroundColor: "#E87500",
            height: "100%",
            color: "white",
            width: "200px",
          }}
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
                Curator
              </Typography>
            </div>
          </ListItem>
          {CuratorNavData.map((item) => (
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
      </Drawer>
    </div>
  );
}

export default CuratorNav;
