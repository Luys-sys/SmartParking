namespace SmartParking.API.DTOs
{
    public class RegisterRequest
    {
        public string FullName { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string? Phone { get; set; }

        public string Password { get; set; } = string.Empty;

        public string Role { get; set; } = "driver";
    }
}