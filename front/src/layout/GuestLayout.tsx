import React from "react";
import { Link, Outlet } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  useTheme,
} from "@mui/material";

const GuestLayout: React.FC = () => {
  const theme = useTheme();

  return (
    <>
      <AppBar
        position="static"
        color="primary"
        elevation={4}
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
        }}
      >
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
                letterSpacing: 2,
                fontSize: "1.5rem",
                "&:hover": { color: theme.palette.secondary.light },
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
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  mr: 1.5,
                  fontSize: "1rem",
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.2)",
                    borderRadius: "6px",
                  },
                }}
              >
                Login
              </Button>
              <Button
                component={Link}
                to="/register"
                variant="outlined"
                color="inherit"
                sx={{
                  ml: 1,
                  textTransform: "none",
                  fontWeight: 600,
                  borderColor: "white",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  paddingX: 2,
                  "&:hover": {
                    borderColor: theme.palette.secondary.light,
                    backgroundColor: "rgba(255,255,255,0.15)",
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
        sx={{
          mt: 6,
          mb: 6,
          minHeight: "calc(100vh - 64px)",
          boxShadow: 3,
          borderRadius: 3,
          padding: 4,
          bgcolor: "background.paper",
        }}
      >
        <Outlet />
      </Container>
    </>
  );
};

export default GuestLayout;
