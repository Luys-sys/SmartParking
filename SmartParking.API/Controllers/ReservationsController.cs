using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartParking.API.Data;
using SmartParking.API.DTOs;
using SmartParking.API.Models;

namespace SmartParking.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReservationsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ReservationsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("user/{userId:int}")]
        public async Task<IActionResult> GetUserReservations(int userId)
        {
            var reservations = await (
                from reservation in _context.Reservations
                join assignment in _context.VehicleAssignments
                    on reservation.AssignmentId equals assignment.AssignmentId
                join vehicle in _context.Vehicles
                    on assignment.VehicleId equals vehicle.VehicleId
                join slot in _context.ParkingSlots
                    on reservation.SlotId equals slot.SlotId
                join lot in _context.ParkingLots
                    on slot.LotId equals lot.LotId
                where assignment.UserId == userId
                orderby reservation.StartTime descending
                select new
                {
                    reservation.ReservationId,
                    reservation.StartTime,
                    reservation.EndTime,
                    reservation.Status,
                    assignment.AssignmentId,
                    vehicle.VehicleId,
                    vehicle.PlateNumber,
                    vehicle.Model,
                    slot.SlotId,
                    slot.SlotNumber,
                    lot.LotId,
                    lot.LotName,
                    lot.Address
                }
            ).ToListAsync();

            return Ok(reservations);
        }

        [HttpPost]
        public async Task<IActionResult> CreateReservation(
            CreateReservationRequest request
        )
        {
            if (request.AssignmentId <= 0 || request.LotId <= 0)
            {
                return BadRequest(new
                {
                    message = "Vehicle and parking lot are required."
                });
            }

            if (request.StartTime >= request.EndTime)
            {
                return BadRequest(new
                {
                    message = "End time must be later than start time."
                });
            }

            if (request.StartTime < DateTime.Now)
            {
                return BadRequest(new
                {
                    message = "Reservation cannot start in the past."
                });
            }

            var assignmentExists = await _context.VehicleAssignments
                .AnyAsync(a => a.AssignmentId == request.AssignmentId);

            if (!assignmentExists)
            {
                return NotFound(new
                {
                    message = "Vehicle assignment was not found."
                });
            }

            var parkingLotExists = await _context.ParkingLots
                .AnyAsync(l => l.LotId == request.LotId);

            if (!parkingLotExists)
            {
                return NotFound(new
                {
                    message = "Parking lot was not found."
                });
            }

            var availableSlot = await _context.ParkingSlots
                .Where(slot =>
                    slot.LotId == request.LotId &&
                    slot.Status != "maintenance"
                )
                .Where(slot =>
                    !_context.Reservations.Any(reservation =>
                        reservation.SlotId == slot.SlotId &&
                        reservation.Status != "cancelled" &&
                        request.StartTime < reservation.EndTime &&
                        request.EndTime > reservation.StartTime
                    )
                )
                .OrderBy(slot => slot.SlotNumber)
                .FirstOrDefaultAsync();

            if (availableSlot == null)
            {
                return BadRequest(new
                {
                    message = "No parking spaces are available for the selected time."
                });
            }

            var reservation = new Reservation
            {
                AssignmentId = request.AssignmentId,
                SlotId = availableSlot.SlotId,
                StartTime = request.StartTime,
                EndTime = request.EndTime,
                Status = "confirmed"
            };

            _context.Reservations.Add(reservation);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Reservation created successfully.",
                reservationId = reservation.ReservationId,
                slotId = availableSlot.SlotId,
                slotNumber = availableSlot.SlotNumber,
                reservation.StartTime,
                reservation.EndTime,
                reservation.Status
            });
        }
    }
}