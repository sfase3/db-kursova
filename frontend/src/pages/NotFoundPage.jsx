// src/components/NotFoundPage.js
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Typography, Button, Container, Grid } from "@mui/material";

function NotFoundPage() {
  return (
    <Container
      sx={{ minHeight: "100vh", display: "flex", alignItems: "center" }}
    >
      <Grid container justifyContent="center" alignItems="center" spacing={2}>
        <Grid item xs={12} textAlign="center">
          <Typography variant="h1" color="textPrimary">
            404
          </Typography>
          <Typography variant="h4" color="textSecondary">
            Oops! Page not found.
          </Typography>
          <Typography
            variant="body1"
            color="textSecondary"
            sx={{ marginTop: 2 }}
          >
            The page you are looking for might have been removed, had its name
            changed, or is temporarily unavailable.
          </Typography>
          <Button
            component={RouterLink}
            to="/"
            variant="contained"
            color="primary"
            size="large"
            sx={{ marginTop: 4 }}
          >
            Go to Home
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}

export default NotFoundPage;
