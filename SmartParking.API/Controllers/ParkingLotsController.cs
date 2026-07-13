using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartParking.API.Data;
using SmartParking.API.Models;

namespace SmartParking.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ParkingLotsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ParkingLotsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetParkingLots()
        {
            var parkingLots = await _context.ParkingLots
                .OrderByDescending(p => p.LotId)
                .ToListAsync();

            return Ok(parkingLots);
        }

        [HttpGet("provider/{providerId:int}")]
        public async Task<IActionResult> GetProviderParkingLots(int providerId)
        {
            var parkingLots = await _context.ParkingLots
                .Where(p => p.ProviderId == providerId)
                .OrderByDescending(p => p.LotId)
                .ToListAsync();

            return Ok(parkingLots);
        }

        [HttpPost]
        public async Task<IActionResult> CreateParkingLot(ParkingLot parkingLot)
        {
            if (string.IsNullOrWhiteSpace(parkingLot.LotName) ||
                string.IsNullOrWhiteSpace(parkingLot.Address) ||
                parkingLot.TotalSpaces <= 0)
            {
                return BadRequest(new
                {
                    message = "Parking name, address and total spaces are required."
                });
            }

            parkingLot.LotId = 0;
            parkingLot.LotName = parkingLot.LotName.Trim();
            parkingLot.Address = parkingLot.Address.Trim();

            await using var transaction =
                await _context.Database.BeginTransactionAsync();

            try
            {
                _context.ParkingLots.Add(parkingLot);
                await _context.SaveChangesAsync();

                var parkingSlots = new List<ParkingSlot>();

                for (int i = 1; i <= parkingLot.TotalSpaces; i++)
                {
                    parkingSlots.Add(new ParkingSlot
                    {
                        LotId = parkingLot.LotId,
                        SlotNumber = $"A{i}",
                        FloorLevel = 1,
                        SlotType = "standard",
                        Status = "available"
                    });
                }

                _context.ParkingSlots.AddRange(parkingSlots);
                await _context.SaveChangesAsync();

                await transaction.CommitAsync();

                return Ok(new
                {
                    message = "Parking lot and slots created successfully.",
                    parkingLot,
                    createdSlots = parkingSlots.Count
                });
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateParkingLot(
            int id,
            ParkingLot updatedParkingLot
        )
        {
            var parkingLot = await _context.ParkingLots.FindAsync(id);

            if (parkingLot == null)
            {
                return NotFound(new { message = "Parking lot not found." });
            }

            if (parkingLot.ProviderId != updatedParkingLot.ProviderId)
            {
                return Forbid();
            }

            if (string.IsNullOrWhiteSpace(updatedParkingLot.LotName) ||
                string.IsNullOrWhiteSpace(updatedParkingLot.Address) ||
                updatedParkingLot.TotalSpaces <= 0)
            {
                return BadRequest(new
                {
                    message = "Parking name, address and total spaces are required."
                });
            }

            parkingLot.LotName = updatedParkingLot.LotName.Trim();
            parkingLot.Address = updatedParkingLot.Address.Trim();
            parkingLot.TotalSpaces = updatedParkingLot.TotalSpaces;

            await _context.SaveChangesAsync();

            return Ok(parkingLot);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteParkingLot(
            int id,
            [FromQuery] int providerId
        )
        {
            var parkingLot = await _context.ParkingLots.FindAsync(id);

            if (parkingLot == null)
            {
                return NotFound(new { message = "Parking lot not found." });
            }

            if (parkingLot.ProviderId != providerId)
            {
                return Forbid();
            }

            _context.ParkingLots.Remove(parkingLot);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}