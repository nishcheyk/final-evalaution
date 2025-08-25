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
  IconButton,
  Tooltip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const drawerWidth = 240;
const collapsedWidth = 72;

const AdminLayout = () => {
  const [open, setOpen] = useState(false);

  const toggleDrawer = () => setOpen((prev) => !prev);

  const menuItems = [
    { to: "create-plan", label: "Create Plan" },
    { to: "manage-plans", label: "Manage Plans" },
    // Add other admin routes here if needed
  ];

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <CssBaseline />
      <Drawer
        variant="permanent"
        open={open}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        sx={{
          width: open ? drawerWidth : collapsedWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: open ? drawerWidth : collapsedWidth,
            boxSizing: "border-box",
            bgcolor: "#121212",
            color: "#e0e0e0",
            transition: (theme) =>
              theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            overflowX: "hidden",
            boxShadow: "2px 0 10px rgba(0,0,0,0.8)",
          },
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: open ? "space-between" : "center",
            alignItems: "center",
            px: 2,
            bgcolor: "#1c1c1c",
            minHeight: 64,
          }}
        >
          {open && (
            <Typography variant="h6" noWrap component="div" color="inherit">
              Admin Menu
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
          {menuItems.map(({ to, label }) => (
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
                      color: "#fff",
                      fontWeight: "bold",
                      borderRadius: 2,
                      boxShadow: "0 0 8px #0f62fecc",
                    },
                    "&:hover": {
                      bgcolor: "#2a2a2a",
                    },
                    transition: "background-color 0.3s, box-shadow 0.3s",
                  }}
                >
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
        <Box sx={{ p: 2, borderTop: "1px solid #2c2c2c" }}>
          {open && <LogoutButton />}
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, bgcolor: "#f4f6f8" }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;
