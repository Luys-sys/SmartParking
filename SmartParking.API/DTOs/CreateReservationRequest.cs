namespace SmartParking.API.DTOs
{
    public class CreateReservationRequest
    {
        public int AssignmentId { get; set; }

        public int LotId { get; set; }

        public DateTime StartTime { get; set; }

        public DateTime EndTime { get; set; }
    }
}