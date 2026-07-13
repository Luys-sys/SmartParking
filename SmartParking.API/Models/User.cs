using System.ComponentModel.DataAnnotations.Schema;

namespace SmartParking.API.Models
{
    [Table("Users")]
    public class User
    {
        [Column("user_id")]
        public int UserId { get; set; }

        [Column("full_name")]
        public string FullName { get; set; } = string.Empty;

        [Column("email")]
        public string Email { get; set; } = string.Empty;

        [Column("phone")]
        public string? Phone { get; set; }

        [Column("password_hash")]
        public string PasswordHash { get; set; } = string.Empty;

        [Column("role")]
        public string Role { get; set; } = "driver";

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}