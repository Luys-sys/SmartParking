import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    if (!email.trim() || !password) {
      setErrorMessage("Please enter your email and password.");
      return;
    }

    try {
      setIsLoading(true);

      const response = await api.post("/Auth/login", {
        email: email.trim(),
        password,
      });

      const user = response.data.user;

      localStorage.setItem("user", JSON.stringify(user));

      if (user.role === "provider") {
        navigate("/provider");
      } else if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/driver");
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "Login failed. Please check your details and try again."
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
      <Card sx={{ width: "100%", maxWidth: 420, borderRadius: 4, boxShadow: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" fontWeight={800} mb={1}>
            Welcome back
          </Typography>

          <Typography color="text.secondary" mb={4}>
            Sign in to SmartParking
          </Typography>

          {errorMessage && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {errorMessage}
            </Alert>
          )}

          <Box component="form" onSubmit={handleLogin}>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              fullWidth
              required
              sx={{ mb: 2 }}
            />

            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              fullWidth
              required
              sx={{ mb: 3 }}
            />

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
                "Login"
              )}
            </Button>
          </Box>

          <Typography textAlign="center" mt={3}>
            Don’t have an account?{" "}
            <Link component="button" onClick={() => navigate("/register")}>
              Register
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Login;