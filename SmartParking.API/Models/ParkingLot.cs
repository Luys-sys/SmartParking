using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SmartParking.API.Models
{
    [Table("ParkingLot")]
    public class ParkingLot
    {
        [Key]
        [Column("lot_id")]
        public int LotId { get; set; }

        [Column("lot_name")]
        public string LotName { get; set; } = string.Empty;

        [Column("address")]
        public string Address { get; set; } = string.Empty;

        [Column("total_spaces")]
        public int TotalSpaces { get; set; }

        [Column("provider_id")]
        public int ProviderId { get; set; }
    }
}