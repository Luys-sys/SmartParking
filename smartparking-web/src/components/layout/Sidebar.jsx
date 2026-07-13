import { Box, List, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import PaymentsIcon from "@mui/icons-material/Payments";
import PeopleIcon from "@mui/icons-material/People";

const menuItems = [
  { text: "Dashboard", icon: <DashboardIcon /> },
  { text: "Vehicles", icon: <DirectionsCarIcon /> },
  { text: "Parking Lots", icon: <LocalParkingIcon /> },
  { text: "Reservations", icon: <EventAvailableIcon /> },
  { text: "Payments", icon: <PaymentsIcon /> },
  { text: "Users", icon: <PeopleIcon /> },
];

function Sidebar() {
  return (
    <Box sx={{ width: 260, minHeight: "100vh", bgcolor: "#0F172A", color: "white", p: 2 }}>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 4 }}>
        SmartParking
      </Typography>

      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.text}
            sx={{
              borderRadius: 3,
              mb: 1,
              "&:hover": { bgcolor: "rgba(255,255,255,0.08)" },
            }}
          >
            <ListItemIcon sx={{ color: "white", minWidth: 40 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}

export default Sidebar;