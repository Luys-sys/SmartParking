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
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import GarageIcon from "@mui/icons-material/Garage";
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import api from "../services/api";

const emptyForm = {
  lotName: "",
  address: "",
  totalSpaces: "",
};

function ProviderDashboard() {
  const [parkingLots, setParkingLots] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editData, setEditData] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const storedUser = localStorage.getItem("user");
  const currentUser = storedUser ? JSON.parse(storedUser) : null;
  const providerId = currentUser?.userId;

  const loadParkingLots = async () => {
    if (!providerId) {
      setErrorMessage("Provider information was not found. Please log in again.");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      const response = await api.get(
        `/ParkingLots/provider/${providerId}`
      );

      setParkingLots(response.data);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "Could not load your parking lots."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadParkingLots();
  }, [providerId]);

  const handleCreateChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const handleCreate = async (event) => {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    const totalSpaces = Number(formData.totalSpaces);

    if (
      !formData.lotName.trim() ||
      !formData.address.trim() ||
      !Number.isInteger(totalSpaces) ||
      totalSpaces <= 0
    ) {
      setErrorMessage(
        "Please enter a parking name, address and valid number of spaces."
      );
      return;
    }

    try {
      setIsSubmitting(true);

      await api.post("/ParkingLots", {
        lotName: formData.lotName.trim(),
        address: formData.address.trim(),
        totalSpaces,
        providerId,
      });

      setFormData(emptyForm);
      setSuccessMessage("Parking lot created successfully.");

      await loadParkingLots();
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "Could not create the parking lot."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditDialog = (parkingLot) => {
    setEditData({
      lotId: parkingLot.lotId,
      lotName: parkingLot.lotName,
      address: parkingLot.address,
      totalSpaces: parkingLot.totalSpaces,
      providerId: parkingLot.providerId,
    });
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;

    setEditData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    const totalSpaces = Number(editData.totalSpaces);

    if (
      !editData.lotName.trim() ||
      !editData.address.trim() ||
      !Number.isInteger(totalSpaces) ||
      totalSpaces <= 0
    ) {
      setErrorMessage("Please enter valid parking lot information.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      await api.put(`/ParkingLots/${editData.lotId}`, {
        lotId: editData.lotId,
        lotName: editData.lotName.trim(),
        address: editData.address.trim(),
        totalSpaces,
        providerId,
      });

      setEditData(null);
      setSuccessMessage("Parking lot updated successfully.");

      await loadParkingLots();
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "Could not update the parking lot."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (parkingLot) => {
    const confirmed = window.confirm(
      `Delete "${parkingLot.lotName}"?`
    );

    if (!confirmed) return;

    try {
      setDeletingId(parkingLot.lotId);
      setErrorMessage("");
      setSuccessMessage("");

      await api.delete(
        `/ParkingLots/${parkingLot.lotId}?providerId=${providerId}`
      );

      setSuccessMessage("Parking lot deleted successfully.");
      await loadParkingLots();
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "Could not delete the parking lot."
      );
    } finally {
      setDeletingId(null);
    }
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
        Provider Dashboard
      </Typography>

      <Typography color="text.secondary" mb={4}>
        Add and manage the parking locations you provide.
      </Typography>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}

      {successMessage && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {successMessage}
        </Alert>
      )}

      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6}>
          <Card sx={{ borderRadius: 4 }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <LocalParkingIcon color="primary" />
                <Box>
                  <Typography color="text.secondary">
                    My Parking Lots
                  </Typography>
                  <Typography variant="h4" fontWeight={800}>
                    {parkingLots.length}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Card sx={{ borderRadius: 4 }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <GarageIcon color="primary" />
                <Box>
                  <Typography color="text.secondary">
                    Total Spaces
                  </Typography>
                  <Typography variant="h4" fontWeight={800}>
                    {totalSpaces}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <Card sx={{ borderRadius: 4 }}>
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" spacing={1.5} mb={3}>
                <AddLocationAltIcon color="primary" />

                <Typography variant="h6" fontWeight={800}>
                  Add Parking Lot
                </Typography>
              </Stack>

              <Box component="form" onSubmit={handleCreate}>
                <TextField
                  name="lotName"
                  label="Parking name"
                  value={formData.lotName}
                  onChange={handleCreateChange}
                  fullWidth
                  required
                  sx={{ mb: 2 }}
                />

                <TextField
                  name="address"
                  label="Address"
                  value={formData.address}
                  onChange={handleCreateChange}
                  fullWidth
                  required
                  sx={{ mb: 2 }}
                />

                <TextField
                  name="totalSpaces"
                  label="Total spaces"
                  type="number"
                  value={formData.totalSpaces}
                  onChange={handleCreateChange}
                  inputProps={{ min: 1 }}
                  fullWidth
                  required
                  sx={{ mb: 3 }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Add Parking Lot"
                  )}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={7}>
          <Card sx={{ borderRadius: 4 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={800} mb={3}>
                My Parking Lots
              </Typography>

              {isLoading ? (
                <Box textAlign="center" py={6}>
                  <CircularProgress />
                </Box>
              ) : parkingLots.length === 0 ? (
                <Typography color="text.secondary">
                  You have not added any parking lots yet.
                </Typography>
              ) : (
                <Stack spacing={2}>
                  {parkingLots.map((parkingLot) => (
                    <Card
                      key={parkingLot.lotId}
                      variant="outlined"
                      sx={{ borderRadius: 3 }}
                    >
                      <CardContent>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="flex-start"
                        >
                          <Box>
                            <Typography fontWeight={800}>
                              {parkingLot.lotName}
                            </Typography>

                            <Typography color="text.secondary">
                              {parkingLot.address}
                            </Typography>

                            <Typography mt={1}>
                              Spaces:{" "}
                              <strong>{parkingLot.totalSpaces}</strong>
                            </Typography>
                          </Box>

                          <Stack direction="row">
                            <Tooltip title="Edit">
                              <IconButton
                                onClick={() =>
                                  openEditDialog(parkingLot)
                                }
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title="Delete">
                              <IconButton
                                color="error"
                                disabled={
                                  deletingId === parkingLot.lotId
                                }
                                onClick={() =>
                                  handleDelete(parkingLot)
                                }
                              >
                                {deletingId === parkingLot.lotId ? (
                                  <CircularProgress size={20} />
                                ) : (
                                  <DeleteIcon />
                                )}
                              </IconButton>
                            </Tooltip>
                          </Stack>
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

      <Dialog
        open={Boolean(editData)}
        onClose={() => setEditData(null)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit Parking Lot</DialogTitle>

        {editData && (
          <DialogContent>
            <TextField
              name="lotName"
              label="Parking name"
              value={editData.lotName}
              onChange={handleEditChange}
              fullWidth
              sx={{ mt: 1, mb: 2 }}
            />

            <TextField
              name="address"
              label="Address"
              value={editData.address}
              onChange={handleEditChange}
              fullWidth
              sx={{ mb: 2 }}
            />

            <TextField
              name="totalSpaces"
              label="Total spaces"
              type="number"
              value={editData.totalSpaces}
              onChange={handleEditChange}
              inputProps={{ min: 1 }}
              fullWidth
            />
          </DialogContent>
        )}

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setEditData(null)}>
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleUpdate}
            disabled={isSubmitting}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
    </>
  );
}

export default ProviderDashboard;