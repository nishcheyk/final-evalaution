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
  Tooltip,
  IconButton,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ListAltIcon from "@mui/icons-material/ListAlt";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";
import MenuIcon from "@mui/icons-material/Menu";

const drawerWidth = 240;
const collapsedWidth = 72;

const UserLayout = () => {
  const [open, setOpen] = useState(false);
  // Toggle sidebar on menu icon click for smaller screens or manual toggle
  const toggleDrawer = () => setOpen(!open);

  const menuItems = [
    { to: "dashboard", label: "Dashboard", icon: <DashboardIcon /> },
    { to: "plans", label: "Plans", icon: <ListAltIcon /> },
    {
      to: "subscriptions",
      label: "My Subscriptions",
      icon: <SubscriptionsIcon />,
    },
  ];

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <CssBaseline />
      <Drawer
        variant="permanent"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        open={open}
        sx={{
          width: open ? drawerWidth : collapsedWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: open ? drawerWidth : collapsedWidth,
            boxSizing: "border-box",
            bgcolor: "#1e1e2f",
            color: "#e0e0e0",
            transition: (theme) =>
              theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            overflowX: "hidden",
            boxShadow: "2px 0 5px rgba(0,0,0,0.3)",
          },
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: open ? "space-between" : "center",
            alignItems: "center",
            px: 2,
            bgcolor: "#151520",
            minHeight: 64,
          }}
        >
          {open && (
            <Typography variant="h6" noWrap component="div" color="inherit">
              User Menu
            </Typography>
          )}
          <IconButton
            onClick={toggleDrawer}
            sx={{ color: "inherit", ml: open ? 0 : "auto" }}
            aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
        <List sx={{ mt: 1 }}>
          {menuItems.map(({ to, label, icon }) => (
            <ListItem key={to} disablePadding sx={{ display: "block" }}>
              <Tooltip title={!open ? label : ""} placement="right">
                <ListItemButton
                  component={NavLink}
                  to={to}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                    color: "inherit",
                    "&.active": {
                      bgcolor: "#0f62fe",
                      color: "white",
                      fontWeight: "bold",
                      borderRadius: 2,
                      boxShadow: "0 0 8px #0f62feaa",
                    },
                    "&:hover": {
                      bgcolor: "#161622",
                    },
                    transition: "background-color 0.3s, box-shadow 0.3s",
                  }}
                >
                  {icon}
                  <ListItemText
                    primary={label}
                    sx={{
                      opacity: open ? 1 : 0,
                      ml: open ? 2 : 0,
                      transition: "opacity 0.3s",
                    }}
                  />
                </ListItemButton>
              </Tooltip>
            </ListItem>
          ))}
        </List>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ p: 2, borderTop: "1px solid #2c2c43" }}>
          {open && <LogoutButton />}
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, bgcolor: "#f9fafb" }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default UserLayout;
