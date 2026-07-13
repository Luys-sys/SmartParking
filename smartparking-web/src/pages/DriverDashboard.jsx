import Navbar from "../components/layout/Navbar";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import PlaceIcon from "@mui/icons-material/Place";
import AddIcon from "@mui/icons-material/Add";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import { useEffect, useState } from "react";
import api from "../services/api";

const emptyVehicleForm = {
  plateNumber: "",
  model: "",
  color: "",
};

const emptyReservationForm = {
  assignmentId: "",
  startTime: "",
  endTime: "",
};

function DriverDashboard() {
  const [parkingLots, setParkingLots] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [reservations, setReservations] = useState([]);

  const [vehicleForm, setVehicleForm] = useState(emptyVehicleForm);
  const [reservationForm, setReservationForm] = useState(
    emptyReservationForm
  );

  const [selectedParkingLot, setSelectedParkingLot] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingVehicle, setIsSubmittingVehicle] = useState(false);
  const [isSubmittingReservation, setIsSubmittingReservation] =
    useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const storedUser = localStorage.getItem("user");
  const currentUser = storedUser ? JSON.parse(storedUser) : null;
  const userId = currentUser?.userId;

  const loadDashboardData = async () => {
    if (!userId) {
      setErrorMessage(
        "User information was not found. Please log in again."
      );
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage("");

      const [parkingResponse, vehiclesResponse, reservationsResponse] =
        await Promise.all([
          api.get("/ParkingLots"),
          api.get(`/Vehicles/user/${userId}`),
          api.get(`/Reservations/user/${userId}`),
        ]);

      setParkingLots(parkingResponse.data);
      setVehicles(vehiclesResponse.data);
      setReservations(reservationsResponse.data);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "Could not load dashboard information."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [userId]);

  const handleVehicleChange = (event) => {
    const { name, value } = event.target;

    setVehicleForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleAddVehicle = async (event) => {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (
      !vehicleForm.plateNumber.trim() ||
      !vehicleForm.model.trim() ||
      !vehicleForm.color.trim()
    ) {
      setErrorMessage("Please fill in all vehicle fields.");
      return;
    }

    try {
      setIsSubmittingVehicle(true);

      await api.post("/Vehicles", {
        userId,
        plateNumber: vehicleForm.plateNumber.trim(),
        model: vehicleForm.model.trim(),
        color: vehicleForm.color.trim(),
      });

      setVehicleForm(emptyVehicleForm);
      setSuccessMessage("Vehicle added successfully.");

      const response = await api.get(`/Vehicles/user/${userId}`);
      setVehicles(response.data);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Could not add the vehicle."
      );
    } finally {
      setIsSubmittingVehicle(false);
    }
  };

  const openReservationDialog = (parkingLot) => {
    setErrorMessage("");
    setSuccessMessage("");
    setSelectedParkingLot(parkingLot);

    setReservationForm({
      assignmentId:
        vehicles.length === 1 ? vehicles[0].assignmentId : "",
      startTime: "",
      endTime: "",
    });
  };

  const closeReservationDialog = () => {
    setSelectedParkingLot(null);
    setReservationForm(emptyReservationForm);
  };

  const handleReservationChange = (event) => {
    const { name, value } = event.target;

    setReservationForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleCreateReservation = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (
      !reservationForm.assignmentId ||
      !reservationForm.startTime ||
      !reservationForm.endTime
    ) {
      setErrorMessage(
        "Please select a vehicle, start time and end time."
      );
      return;
    }

    if (
      new Date(reservationForm.startTime) >=
      new Date(reservationForm.endTime)
    ) {
      setErrorMessage("End time must be later than start time.");
      return;
    }

    try {
      setIsSubmittingReservation(true);

      const response = await api.post("/Reservations", {
        assignmentId: Number(reservationForm.assignmentId),
        lotId: selectedParkingLot.lotId,
        startTime: reservationForm.startTime,
        endTime: reservationForm.endTime,
      });

      closeReservationDialog();

      setSuccessMessage(
        `Reservation created successfully. Your parking slot is ${response.data.slotNumber}.`
      );

      const reservationsResponse = await api.get(
        `/Reservations/user/${userId}`
      );

      setReservations(reservationsResponse.data);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "Could not create the reservation."
      );
    } finally {
      setIsSubmittingReservation(false);
    }
  };

  const formatDateTime = (value) => {
    if (!value) return "";

    return new Date(value).toLocaleString();
  };

  const totalSpaces = parkingLots.reduce(
    (sum, parkingLot) => sum + parkingLot.totalSpaces,
    0
  );

  

  return (
    <>
    <Navbar />

    <Box
      component="main"
      sx={{
        minHeight: "100vh",
        bgcolor: "#F5F7FA",
        p: { xs: 2, md: 4 },
      }}
    >
      <Typography variant="h4" fontWeight={800} mb={1}>
        Driver Dashboard
      </Typography>

      <Typography color="text.secondary" mb={4}>
        Welcome
        {currentUser?.fullName ? `, ${currentUser.fullName}` : ""}.
        Manage your vehicles and reserve parking.
      </Typography>

      {errorMessage && (
        <Alert
          severity="error"
          onClose={() => setErrorMessage("")}
          sx={{ mb: 3 }}
        >
          {errorMessage}
        </Alert>
      )}

      {successMessage && (
        <Alert
          severity="success"
          onClose={() => setSuccessMessage("")}
          sx={{ mb: 3 }}
        >
          {successMessage}
        </Alert>
      )}

      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 4 }}>
            <CardContent>
              <DirectionsCarIcon color="primary" />

              <Typography color="text.secondary" mt={1}>
                My Vehicles
              </Typography>

              <Typography variant="h4" fontWeight={800}>
                {vehicles.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 4 }}>
            <CardContent>
              <LocalParkingIcon color="primary" />

              <Typography color="text.secondary" mt={1}>
                Parking Lots
              </Typography>

              <Typography variant="h4" fontWeight={800}>
                {parkingLots.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 4 }}>
            <CardContent>
              <EventAvailableIcon color="primary" />

              <Typography color="text.secondary" mt={1}>
                My Reservations
              </Typography>

              <Typography variant="h4" fontWeight={800}>
                {reservations.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 4 }}>
            <CardContent>
              <LocalParkingIcon color="primary" />

              <Typography color="text.secondary" mt={1}>
                Total Spaces
              </Typography>

              <Typography variant="h4" fontWeight={800}>
                {totalSpaces}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={5}>
          <Card sx={{ borderRadius: 4 }}>
            <CardContent sx={{ p: 3 }}>
              <Stack
                direction="row"
                spacing={1.5}
                alignItems="center"
                mb={3}
              >
                <AddIcon color="primary" />

                <Typography variant="h6" fontWeight={800}>
                  Add Vehicle
                </Typography>
              </Stack>

              <Box component="form" onSubmit={handleAddVehicle}>
                <TextField
                  name="plateNumber"
                  label="Plate number"
                  value={vehicleForm.plateNumber}
                  onChange={handleVehicleChange}
                  fullWidth
                  required
                  sx={{ mb: 2 }}
                />

                <TextField
                  name="model"
                  label="Model"
                  value={vehicleForm.model}
                  onChange={handleVehicleChange}
                  fullWidth
                  required
                  sx={{ mb: 2 }}
                />

                <TextField
                  name="color"
                  label="Color"
                  value={vehicleForm.color}
                  onChange={handleVehicleChange}
                  fullWidth
                  required
                  sx={{ mb: 3 }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={isSubmittingVehicle || !userId}
                >
                  {isSubmittingVehicle ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Add Vehicle"
                  )}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={7}>
          <Card sx={{ borderRadius: 4, height: "100%" }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={800} mb={3}>
                My Vehicles
              </Typography>

              {isLoading ? (
                <Box textAlign="center" py={5}>
                  <CircularProgress />
                </Box>
              ) : vehicles.length === 0 ? (
                <Typography color="text.secondary">
                  You have not added any vehicles yet.
                </Typography>
              ) : (
                <Stack spacing={2}>
                  {vehicles.map((vehicle) => (
                    <Card
                      key={vehicle.assignmentId}
                      variant="outlined"
                      sx={{ borderRadius: 3 }}
                    >
                      <CardContent>
                        <Stack
                          direction="row"
                          spacing={2}
                          alignItems="center"
                        >
                          <DirectionsCarIcon color="primary" />

                          <Box>
                            <Typography fontWeight={800}>
                              {vehicle.model}
                            </Typography>

                            <Typography color="text.secondary">
                              Plate: {vehicle.plateNumber}
                            </Typography>

                            <Typography color="text.secondary">
                              Color: {vehicle.color}
                            </Typography>
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ borderRadius: 4, mb: 4 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={800} mb={3}>
            Available Parking Lots
          </Typography>

          {isLoading ? (
            <Box textAlign="center" py={5}>
              <CircularProgress />
            </Box>
          ) : parkingLots.length === 0 ? (
            <Typography color="text.secondary">
              No parking lots are available yet.
            </Typography>
          ) : (
            <Grid container spacing={2}>
              {parkingLots.map((parkingLot) => (
                <Grid
                  item
                  xs={12}
                  md={6}
                  lg={4}
                  key={parkingLot.lotId}
                >
                  <Card
                    variant="outlined"
                    sx={{ borderRadius: 3, height: "100%" }}
                  >
                    <CardContent>
                      <Stack
                        direction="row"
                        spacing={1.5}
                        alignItems="center"
                        mb={2}
                      >
                        <LocalParkingIcon color="primary" />

                        <Typography fontWeight={800}>
                          {parkingLot.lotName}
                        </Typography>
                      </Stack>

                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                      >
                        <PlaceIcon fontSize="small" color="action" />

                        <Typography color="text.secondary">
                          {parkingLot.address}
                        </Typography>
                      </Stack>

                      <Typography mt={2}>
                        Total spaces:{" "}
                        <strong>{parkingLot.totalSpaces}</strong>
                      </Typography>

                      <Button
                        variant="contained"
                        fullWidth
                        sx={{ mt: 3 }}
                        disabled={vehicles.length === 0}
                        onClick={() =>
                          openReservationDialog(parkingLot)
                        }
                      >
                        Reserve
                      </Button>

                      {vehicles.length === 0 && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                          textAlign="center"
                          mt={1}
                        >
                          Add a vehicle before reserving.
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: 4 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={800} mb={3}>
            My Reservations
          </Typography>

          {isLoading ? (
            <Box textAlign="center" py={5}>
              <CircularProgress />
            </Box>
          ) : reservations.length === 0 ? (
            <Typography color="text.secondary">
              You have no reservations yet.
            </Typography>
          ) : (
            <Stack spacing={2}>
              {reservations.map((reservation) => (
                <Card
                  key={reservation.reservationId}
                  variant="outlined"
                  sx={{ borderRadius: 3 }}
                >
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={4}>
                        <Typography fontWeight={800}>
                          {reservation.lotName}
                        </Typography>

                        <Typography color="text.secondary">
                          {reservation.address}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={3}>
                        <Typography fontWeight={700}>
                          Vehicle
                        </Typography>

                        <Typography color="text.secondary">
                          {reservation.model} —{" "}
                          {reservation.plateNumber}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={3}>
                        <Typography fontWeight={700}>
                          Time
                        </Typography>

                        <Typography color="text.secondary">
                          {formatDateTime(reservation.startTime)}
                        </Typography>

                        <Typography color="text.secondary">
                          {formatDateTime(reservation.endTime)}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={2}>
                        <Typography fontWeight={700}>
                          Slot
                        </Typography>

                        <Typography color="primary" fontWeight={800}>
                          {reservation.slotNumber}
                        </Typography>

                        <Typography
                          variant="caption"
                          sx={{ textTransform: "capitalize" }}
                        >
                          {reservation.status}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={Boolean(selectedParkingLot)}
        onClose={closeReservationDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          Reserve {selectedParkingLot?.lotName}
        </DialogTitle>

        <DialogContent>
          <Typography color="text.secondary" mb={3}>
            {selectedParkingLot?.address}
          </Typography>

          <TextField
            name="assignmentId"
            select
            label="Vehicle"
            value={reservationForm.assignmentId}
            onChange={handleReservationChange}
            fullWidth
            required
            sx={{ mb: 2 }}
          >
            {vehicles.map((vehicle) => (
              <MenuItem
                key={vehicle.assignmentId}
                value={vehicle.assignmentId}
              >
                {vehicle.model} — {vehicle.plateNumber}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            name="startTime"
            label="Start time"
            type="datetime-local"
            value={reservationForm.startTime}
            onChange={handleReservationChange}
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />

          <TextField
            name="endTime"
            label="End time"
            type="datetime-local"
            value={reservationForm.endTime}
            onChange={handleReservationChange}
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={closeReservationDialog}>
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleCreateReservation}
            disabled={isSubmittingReservation}
          >
            {isSubmittingReservation ? (
              <CircularProgress size={22} color="inherit" />
            ) : (
              "Confirm Reservation"
            )}
          </Button>
        </DialogActions>
      </Dialog>
        </Box>
  </>
);
}

export default DriverDashboard;