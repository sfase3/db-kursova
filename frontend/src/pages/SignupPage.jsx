import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
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

const SignupPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      repeatPassword: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Username is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .required("Password is required")
        .min(8, "Password must be at least 8 characters"),
      repeatPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Repeat password is required"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}auth/register`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          }
        );

        if (!response.ok) {
          throw new Error("Register failed");
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
          Sign Up
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
              id="username"
              name="username"
              label="Username"
              variant="outlined"
              value={formik.values.username}
              onChange={formik.handleChange}
              error={formik.touched.username && Boolean(formik.errors.username)}
              helperText={formik.touched.username && formik.errors.username}
            />
          </Grid>
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
            <TextField
              fullWidth
              id="repeatPassword"
              name="repeatPassword"
              label="Repeat Password"
              type="password"
              variant="outlined"
              value={formik.values.repeatPassword}
              onChange={formik.handleChange}
              error={
                formik.touched.repeatPassword &&
                Boolean(formik.errors.repeatPassword)
              }
              helperText={
                formik.touched.repeatPassword && formik.errors.repeatPassword
              }
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Sign Up
            </Button>
          </Grid>
        </Grid>
      </form>
      <Typography variant="body1" align="center" gutterBottom>
        Already have an account?{" "}
        <Link component={RouterLink} to="/signin">
          Sign In
        </Link>
      </Typography>
    </Container>
  );
};

export default SignupPage;
