import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Link,
  Box,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useFormik } from "formik";

const SigninPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validate: (values) => {
      const errors = {};
      if (!values.email) {
        errors.email = "Email is required";
      }
      if (!values.password) {
        errors.password = "Password is required";
      }
      return errors;
    },
    onSubmit: async (values) => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}auth/login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          }
        );

        if (!response.ok) {
          throw new Error("Login failed");
        }

        const data = await response.text();
        console.log("Login successful. Response:", data);
        localStorage.setItem("jwt", data);
        navigate("/");
        setError(null);
      } catch (error) {
        console.error("Login error:", error.message);
        setError("Login failed. Please check your credentials.");
      }
    },
  });

  return (
    <Container maxWidth="sm">
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6">
          <Link component={RouterLink} to="/" underline="none" color="inherit">
            Back
          </Link>
        </Typography>
        <Typography variant="h4" gutterBottom>
          Sign In
        </Typography>
      </Box>
      {error && (
        <Typography variant="body2" color="error" align="center" gutterBottom>
          {error}
        </Typography>
      )}
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="email"
              name="email"
              label="Email"
              type="email"
              variant="outlined"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="password"
              name="password"
              label="Password"
              type="password"
              variant="outlined"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Sign In
            </Button>
          </Grid>
        </Grid>
      </form>

      {/* Sign Up Link */}
      <Typography variant="body1" align="center" gutterBottom>
        Don't have an account?{" "}
        <Link component={RouterLink} to="/signup">
          Sign Up
        </Link>
      </Typography>
    </Container>
  );
};

export default SigninPage;
