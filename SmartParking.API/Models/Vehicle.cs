using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SmartParking.API.Models
{
    [Table("Vehicle")]
    public class Vehicle
    {
        [Key]
        [Column("vehicle_id")]
        public int VehicleId { get; set; }

        [Column("plate_number")]
        public string PlateNumber { get; set; } = string.Empty;

        [Column("model")]
        public string Model { get; set; } = string.Empty;

        [Column("color")]
        public string Color { get; set; } = string.Empty;
    }
}