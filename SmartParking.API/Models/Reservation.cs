using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SmartParking.API.Models
{
    [Table("Reservation")]
    public class Reservation
    {
        [Key]
        [Column("reservation_id")]
        public int ReservationId { get; set; }

        [Column("start_time")]
        public DateTime StartTime { get; set; }

        [Column("end_time")]
        public DateTime EndTime { get; set; }

        [Column("status")]
        public string Status { get; set; } = "confirmed";

        [Column("slot_id")]
        public int SlotId { get; set; }

        [Column("assignment_id")]
        public int AssignmentId { get; set; }
    }
}