import React, { useState, useEffect } from "react";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Container,
  CircularProgress,
  Pagination,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [carsData, setCarsData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [conditionFilter, setConditionFilter] = useState("");
  const [mileageFilter, setMileageFilter] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");
  const [modelFilter, setModelFilter] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        let apiUrl = `${
          import.meta.env.VITE_API_BASE_URL
        }cars?page=${currentPage}&limit=5`;

        // Add condition filters to the API request
        if (conditionFilter) {
          apiUrl += `&condition=${conditionFilter}`;
        }

        // Add mileage filter to the API request
        if (mileageFilter) {
          apiUrl += `&mileage=${mileageFilter}`;
        }

        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          navigate("/signin");
        }
        const data = await response.json();
        setCarsData(data);
      } catch (error) {
        navigate("/signin");
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [currentPage, conditionFilter, mileageFilter]);

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const handleShowMore = (carId) => {
    navigate(`/cars/${carId}`);
    console.log(`Show more details for car ID: ${carId}`);
  };

  const handleConditionFilterChange = (event) => {
    setConditionFilter(event.target.value);
  };

  const handleMileageFilterChange = (event) => {
    setMileageFilter(event.target.value);
  };

  const handleCompanyFilterChange = (event) => {
    setCompanyFilter(event.target.value);
  };

  const handleModelFilterChange = (event) => {
    setModelFilter(event.target.value);
  };

  // Filter cars based on company and model locally
  const filteredCars = carsData
    ? carsData.cars.filter((car) => {
        // Apply company and model filters if set
        const companyMatch = companyFilter
          ? car.company.fullname
              .toLowerCase()
              .includes(companyFilter.toLowerCase())
          : true;
        const modelMatch = modelFilter
          ? car.model.toLowerCase().includes(modelFilter.toLowerCase())
          : true;
        return companyMatch && modelMatch;
      })
    : [];

  return (
    <Container sx={{ marginTop: 2, marginBottom: 2 }}>
      <Typography variant="h3" gutterBottom>
        Welcome to the Cars List
      </Typography>
      <Typography variant="body1" gutterBottom>
        Here you can explore our latest collection of cars available for sale,
        including both new and used models. Scroll through the list below to
        discover more details about each vehicle.
      </Typography>

      {/* Filter Inputs */}
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel id="condition-filter-label">
              Filter by Condition
            </InputLabel>
            <Select
              labelId="condition-filter-label"
              id="condition-filter"
              value={conditionFilter}
              onChange={handleConditionFilterChange}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="new">New</MenuItem>
              <MenuItem value="used">Used</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            id="mileage-filter"
            label="Filter by Mileage"
            variant="outlined"
            value={mileageFilter}
            onChange={handleMileageFilterChange}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            id="company-filter"
            label="Filter by Company"
            variant="outlined"
            value={companyFilter}
            onChange={handleCompanyFilterChange}
          />
        </Grid>
      </Grid>

      {/* Cars List */}
      {filteredCars.length > 0 ? (
        <>
          <List>
            {filteredCars.map((car) => (
              <ListItem key={car.id}>
                <ListItemText
                  primary={`${car.company.fullname} - ${car.model}`}
                  secondary={`Year: ${car.year}, Mileage: ${car.mileage}`}
                />
                <Button
                  variant="outlined"
                  onClick={() => handleShowMore(car.id)}
                >
                  Show More
                </Button>
              </ListItem>
            ))}
          </List>
          <Pagination
            count={carsData.totalPages}
            page={parseInt(carsData.currentPage)}
            onChange={handlePageChange}
            sx={{ marginTop: 2 }}
          />
        </>
      ) : (
        <Typography variant="body1">
          No cars match the selected filters.
        </Typography>
      )}
    </Container>
  );
};

export default HomePage;
