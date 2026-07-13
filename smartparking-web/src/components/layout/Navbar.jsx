import {
  Avatar,
  Box,
  Button,
  Chip,
  Typography,
} from "@mui/material";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const getInitial = () => {
    return user?.fullName?.charAt(0)?.toUpperCase() || "U";
  };

  return (
    <Box
      component="header"
      sx={{
        minHeight: 72,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        px: { xs: 2, md: 4 },
        py: 1.5,
        bgcolor: "white",
        borderBottom: "1px solid #E5E7EB",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <LocalParkingIcon color="primary" />

        <Typography variant="h6" fontWeight={800}>
          SmartParking
        </Typography>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Box sx={{ display: { xs: "none", sm: "block" }, textAlign: "right" }}>
          <Typography variant="body2" fontWeight={700}>
            {user?.fullName || "User"}
          </Typography>

          <Chip
            label={user?.role || "guest"}
            size="small"
            sx={{
              mt: 0.5,
              textTransform: "capitalize",
            }}
          />
        </Box>

        <Avatar sx={{ bgcolor: "primary.main" }}>
          {getInitial()}
        </Avatar>

        <Button
          variant="outlined"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );
}

export default Navbar;