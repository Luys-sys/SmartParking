import { Box, Card, CardContent, Grid, Typography } from "@mui/material";

const cards = [
  { title: "Vehicles", value: 154 },
  { title: "Active Reservations", value: 36 },
  { title: "Free Spaces", value: 84 },
  { title: "Today's Revenue", value: "$2,540" },
];

function Dashboard() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight={700} mb={4}>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {cards.map((card) => (
          <Grid item xs={12} sm={6} md={3} key={card.title}>
            <Card
              sx={{
                borderRadius: 4,
                boxShadow: 3,
              }}
            >
              <CardContent>
                <Typography color="text.secondary">
                  {card.title}
                </Typography>

                <Typography
                  variant="h4"
                  fontWeight={700}
                  mt={1}
                >
                  {card.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default Dashboard;