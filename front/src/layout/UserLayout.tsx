import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  CssBaseline,
  Toolbar,
  Typography,
} from "@mui/material";

const drawerWidth = 220;
const collapsedWidth = 60;

const UserLayout = () => {
  const [open, setOpen] = useState(false);

  const menuItems = [
    { to: "dashboard", label: "Dashboard" },
    { to: "plans", label: "Plans" },
    { to: "leaderboard", label: "Leaderboard" },
  ];

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <CssBaseline />
      <Drawer
        variant="permanent"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        sx={{
          width: open ? drawerWidth : collapsedWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: open ? drawerWidth : collapsedWidth,
            boxSizing: "border-box",
            bgcolor: "#333",
            color: "white",
            transition: (theme) =>
              theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            overflowX: "hidden",
          },
        }}
      >
        <Toolbar>
          {open && (
            <Typography variant="h6" noWrap component="div" color="white">
              User Menu
            </Typography>
          )}
        </Toolbar>
        <List>
          {menuItems.map(({ to, label }) => (
            <ListItem key={to} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                component={NavLink}
                to={to}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                  color: "white",
                  "&.active": {
                    bgcolor: "#0f62fe",
                    color: "white",
                    fontWeight: "bold",
                  },
                }}
              >
                <ListItemText primary={label} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ p: 2 }}>{open ? <LogoutButton /> : null}</Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default UserLayout;
