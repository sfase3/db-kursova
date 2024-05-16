import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Paper,
  CircularProgress,
  Button,
  Modal,
  Box,
  IconButton,
} from "@mui/material";

const CarPage = () => {
  const { id } = useParams();
  const [carData, setCarData] = useState(null);
  const [showDeleteCarModal, setShowDeleteCarModal] = useState(false);
  const [showDeleteDetailModal, setShowDeleteDetailModal] = useState(false);
  const [detailIdToDelete, setDetailIdToDelete] = useState(null);

  const navigate = useNavigate();
  const fetchCarData = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}cars/${id}`,
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
      setCarData(data);
    } catch (error) {
      console.error("Error fetching car data:", error);
    }
  };
  useEffect(() => {
    fetchCarData();
  }, [id]);

  const handleAddDetail = () => {
    navigate(`detail/add`);
  };
  const handleDeleteCar = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}cars/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete car");
      }
      navigate("/");
    } catch (error) {
      console.error("Error deleting car:", error);
    }
  };

  const handleDeleteDetail = async () => {
    if (!detailIdToDelete) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}details/${detailIdToDelete}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete detail");
      }
      setCarData((car) => car.details.filter((d) => d.id != detailIdToDelete));
      await fetchCarData();
    } catch (error) {
      console.error("Error deleting detail:", error);
    } finally {
      setDetailIdToDelete(null);
      setShowDeleteDetailModal(false);
    }
  };

  const renderDetails = () => {
    if (!carData || !carData.details) return null;

    return (
      <ul>
        {carData.details.map((detail) => (
          <li key={detail.id}>
            <Typography variant="subtitle1" gutterBottom>
              {detail.fullname}
            </Typography>
            <Typography variant="body2" gutterBottom>
              Serviceable: {detail.serviceable ? "Yes" : "No"}
            </Typography>
            <Typography variant="body2" gutterBottom>
              Price: ${detail.price}
            </Typography>
            <IconButton
              color="secondary"
              onClick={() => {
                setDetailIdToDelete(detail.id);
                setShowDeleteDetailModal(true);
              }}
            >
              <Typography variant="body1" color="error">
                Delete
              </Typography>
            </IconButton>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <Container maxWidth="md">
      {carData ? (
        <Paper style={{ padding: "20px", marginBottom: "20px" }}>
          <Typography variant="h4" gutterBottom>
            {carData.model}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Country:</strong> {carData.country}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Year:</strong> {carData.year}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Mileage:</strong> {carData.mileage}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Condition:</strong> {carData.condition}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Price:</strong> ${carData.price}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>VIN:</strong> {carData.vin}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Description:</strong> {carData.description}
          </Typography>
          <Button
            variant="contained"
            color="error"
            onClick={() => setShowDeleteCarModal(true)}
          >
            Delete Car
          </Button>
          <Typography variant="h6" gutterBottom style={{ marginTop: "20px" }}>
            Details:
          </Typography>
          {renderDetails()}
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleAddDetail()}
          >
            Add Detail
          </Button>
        </Paper>
      ) : (
        <CircularProgress />
      )}

      {/* Delete Car Confirmation Modal */}
      <Modal
        open={showDeleteCarModal}
        onClose={() => setShowDeleteCarModal(false)}
        aria-labelledby="delete-car-modal-title"
        aria-describedby="delete-car-modal-description"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box sx={{ padding: 2, backgroundColor: "#fff", maxWidth: 400 }}>
          <Typography variant="h6" id="delete-car-modal-title" gutterBottom>
            Confirm Deletion
          </Typography>
          <Typography
            variant="body1"
            id="delete-car-modal-description"
            gutterBottom
          >
            Are you sure you want to delete this car?
          </Typography>
          <Button variant="contained" color="error" onClick={handleDeleteCar}>
            Delete
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setShowDeleteCarModal(false)}
          >
            Cancel
          </Button>
        </Box>
      </Modal>

      {/* Delete Detail Confirmation Modal */}
      <Modal
        open={showDeleteDetailModal}
        onClose={() => setShowDeleteDetailModal(false)}
        aria-labelledby="delete-detail-modal-title"
        aria-describedby="delete-detail-modal-description"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box sx={{ padding: 2, backgroundColor: "#fff", maxWidth: 400 }}>
          <Typography variant="h6" id="delete-detail-modal-title" gutterBottom>
            Confirm Deletion
          </Typography>
          <Typography
            variant="body1"
            id="delete-detail-modal-description"
            gutterBottom
          >
            Are you sure you want to delete this detail?
          </Typography>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteDetail}
          >
            Delete
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setShowDeleteDetailModal(false)}
          >
            Cancel
          </Button>
        </Box>
      </Modal>
    </Container>
  );
};

export default CarPage;
