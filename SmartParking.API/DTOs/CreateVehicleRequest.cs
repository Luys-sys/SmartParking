namespace SmartParking.API.DTOs
{
    public class CreateVehicleRequest
    {
        public int UserId { get; set; }

        public string PlateNumber { get; set; } = string.Empty;

        public string Model { get; set; } = string.Empty;

        public string Color { get; set; } = string.Empty;
    }
}