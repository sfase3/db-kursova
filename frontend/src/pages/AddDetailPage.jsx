import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";

const AddDetailPage = () => {
  const { carId } = useParams();
  const [newDetail, setNewDetail] = useState({
    fullname: "",
    serviceable: false,
    price: "",
  });

  const [detailIds, setDetailIds] = useState(null);
  useEffect(() => {
    const fetchCarData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}cars/${carId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwt")}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch car data");
        }
        const data = await response.json();

        setDetailIds(data.details.map((d) => d.id));
      } catch (error) {
        console.error("Error fetching car data:", error);
      }
    };

    fetchCarData();
  }, [carId]);

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    const newValue = e.target.type === "checkbox" ? checked : value;

    setNewDetail((prevDetail) => ({
      ...prevDetail,
      [name]: newValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        body: JSON.stringify(newDetail),
      });

      if (!response.ok) {
        throw new Error("Failed to create detail");
      }

      const createdDetail = await response.json();

      const linkResponse = await fetch(
        `http://localhost:3000/cars/${carId}/details`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
          body: JSON.stringify({
            detailsIds: [...detailIds, createdDetail.id],
          }),
        }
      );

      if (!linkResponse.ok) {
        throw new Error("Failed to link detail to car");
      }

      navigate(`/cars/${carId}`);
    } catch (error) {
      console.error("Error adding detail:", error);
      // Handle error state or display error message
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Add New Detail
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Detail Full Name"
          name="fullname"
          value={newDetail.fullname}
          onChange={handleChange}
          variant="outlined"
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Price"
          name="price"
          value={newDetail.price}
          onChange={handleChange}
          variant="outlined"
          margin="normal"
          required
          type="number"
          InputProps={{
            inputProps: {
              min: 0,
            },
          }}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={newDetail.serviceable}
              onChange={handleChange}
              name="serviceable"
              color="primary"
            />
          }
          label="Serviceable"
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? "Adding..." : "Add Detail"}
        </Button>
      </form>
    </Container>
  );
};

export default AddDetailPage;
