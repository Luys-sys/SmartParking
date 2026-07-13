using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SmartParking.API.Models
{
    [Table("ParkingSlot")]
    public class ParkingSlot
    {
        [Key]
        [Column("slot_id")]
        public int SlotId { get; set; }

        [Column("slot_number")]
        public string SlotNumber { get; set; } = string.Empty;

        [Column("floor_level")]
        public int FloorLevel { get; set; }

        [Column("slot_type")]
        public string SlotType { get; set; } = "standard";

        [Column("status")]
        public string Status { get; set; } = "available";

        [Column("lot_id")]
        public int LotId { get; set; }
    }
}