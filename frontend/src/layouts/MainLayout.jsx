import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  CssBaseline,
  Container,
  Button,
  Box, // Import Box component from MUI for flexible layout
} from "@mui/material";
import {
  Link,
  Outlet,
  Link as RouterLink,
  useNavigate,
} from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function MainLayout() {
  const [user, setUser] = useState(() => {
    const jwtToken = localStorage.getItem("jwt");
    return jwtToken ? jwtDecode(jwtToken) : null;
  });

  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/signin");
    localStorage.removeItem("jwt");
    setUser(null);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <CssBaseline />
      {/* App Bar */}
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link style={{ textDecoration: "none", color: "inherit" }} to={"/"}>
              Autos
            </Link>
          </Typography>
          {/* Use Box component for flexible layout */}
          <Box sx={{ display: "flex", gap: 1 }}>
            {user ? (
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <>
                <Button component={RouterLink} to="/signin" color="inherit">
                  Login
                </Button>
                <Button component={RouterLink} to="/signup" color="inherit">
                  Register
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      {/* Main Content */}
      <Container
        style={{
          flexGrow: 1,
          paddingTop: "64px", // Adjust padding to accommodate AppBar height
          paddingBottom: "24px",
        }}
      >
        <Outlet />
      </Container>
    </div>
  );
}

export default MainLayout;
