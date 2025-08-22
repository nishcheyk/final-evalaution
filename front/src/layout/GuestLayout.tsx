// src/layout/GuestLayout.tsx
import React from "react";
import { Link, Outlet } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
} from "@mui/material";

const GuestLayout: React.FC = () => {
  return (
    <>
      <AppBar position="static" color="primary" elevation={3}>
        <Container maxWidth="lg">
          <Toolbar
            disableGutters
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            {/* NGO Name or Logo */}
            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{
                textDecoration: "none",
                color: "inherit",
                fontWeight: "bold",
                letterSpacing: 1,
                cursor: "pointer",
              }}
            >
              NGO Funding Platform
            </Typography>

            {/* Right side navigation: Login / Register */}
            <Box>
              <Button
                component={Link}
                to="/login"
                color="inherit"
                sx={{ textTransform: "none", fontWeight: "bold" }}
              >
                Login
              </Button>
              <Button
                component={Link}
                to="/register"
                variant="outlined"
                color="inherit"
                sx={{
                  ml: 2,
                  textTransform: "none",
                  fontWeight: "bold",
                  borderColor: "white",
                  "&:hover": {
                    borderColor: "white",
                    backgroundColor: "rgba(255,255,255,0.1)",
                  },
                }}
              >
                Register
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Page content container */}
      <Container
        maxWidth="md"
        sx={{ mt: 4, mb: 4, minHeight: "calc(100vh - 64px)" }}
      >
        <Outlet />
      </Container>
    </>
  );
};

export default GuestLayout;
