import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Link,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    role: "driver",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (
      !formData.fullName.trim() ||
      !formData.email.trim() ||
      !formData.password
    ) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage("Password must contain at least 6 characters.");
      return;
    }

    try {
      setIsLoading(true);

      await api.post("/Auth/register", {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || null,
        password: formData.password,
        role: formData.role,
      });

      setSuccessMessage("Account created successfully. Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      component="main"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#F4F7FB",
        p: 2,
      }}
    >
      <Card sx={{ width: "100%", maxWidth: 460, borderRadius: 4, boxShadow: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" fontWeight={800} mb={1}>
            Create account
          </Typography>

          <Typography color="text.secondary" mb={4}>
            Join as a driver or parking provider
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

          <Box component="form" onSubmit={handleRegister}>
            <TextField
              name="fullName"
              label="Full name"
              value={formData.fullName}
              onChange={handleChange}
              autoComplete="name"
              fullWidth
              required
              sx={{ mb: 2 }}
            />

            <TextField
              name="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              fullWidth
              required
              sx={{ mb: 2 }}
            />

            <TextField
              name="phone"
              label="Phone"
              value={formData.phone}
              onChange={handleChange}
              autoComplete="tel"
              fullWidth
              sx={{ mb: 2 }}
            />

            <TextField
              name="password"
              label="Password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
              helperText="Minimum 6 characters"
              fullWidth
              required
              sx={{ mb: 2 }}
            />

            <TextField
              name="role"
              select
              label="Account type"
              value={formData.role}
              onChange={handleChange}
              fullWidth
              sx={{ mb: 3 }}
            >
              <MenuItem value="driver">Driver</MenuItem>
              <MenuItem value="provider">Parking Provider</MenuItem>
            </TextField>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={isLoading}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Register"
              )}
            </Button>
          </Box>

          <Typography textAlign="center" mt={3}>
            Already have an account?{" "}
            <Link component="button" onClick={() => navigate("/login")}>
              Login
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Register;