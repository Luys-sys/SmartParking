using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SmartParking.API.Models
{
    [Table("VehicleAssignment")]
    public class VehicleAssignment
    {
        [Key]
        [Column("assignment_id")]
        public int AssignmentId { get; set; }

        [Column("user_id")]
        public int UserId { get; set; }

        [Column("vehicle_id")]
        public int VehicleId { get; set; }

        [Column("assigned_at")]
        public DateTime AssignedAt { get; set; }
    }
}