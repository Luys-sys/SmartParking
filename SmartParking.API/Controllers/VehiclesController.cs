using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartParking.API.Data;
using SmartParking.API.DTOs;
using SmartParking.API.Models;

namespace SmartParking.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VehiclesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public VehiclesController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("user/{userId:int}")]
        public async Task<IActionResult> GetUserVehicles(int userId)
        {
            var vehicles = await (
                from assignment in _context.VehicleAssignments
                join vehicle in _context.Vehicles
                    on assignment.VehicleId equals vehicle.VehicleId
                where assignment.UserId == userId
                orderby assignment.AssignedAt descending
                select new
                {
                    assignment.AssignmentId,
                    vehicle.VehicleId,
                    vehicle.PlateNumber,
                    vehicle.Model,
                    vehicle.Color,
                    assignment.AssignedAt
                }
            ).ToListAsync();

            return Ok(vehicles);
        }

        [HttpPost]
        public async Task<IActionResult> CreateVehicle(
            CreateVehicleRequest request
        )
        {
            if (
                request.UserId <= 0 ||
                string.IsNullOrWhiteSpace(request.PlateNumber) ||
                string.IsNullOrWhiteSpace(request.Model) ||
                string.IsNullOrWhiteSpace(request.Color)
            )
            {
                return BadRequest(new
                {
                    message = "User, plate number, model and color are required."
                });
            }

            var userExists = await _context.Users
                .AnyAsync(user => user.UserId == request.UserId);

            if (!userExists)
            {
                return NotFound(new { message = "User not found." });
            }

            var normalizedPlateNumber = request.PlateNumber
                .Trim()
                .ToUpper();

            await using var transaction =
                await _context.Database.BeginTransactionAsync();

            try
            {
                var vehicle = await _context.Vehicles
                    .FirstOrDefaultAsync(v =>
                        v.PlateNumber.ToUpper() == normalizedPlateNumber
                    );

                var isNewVehicle = vehicle == null;

                if (vehicle == null)
                {
                    vehicle = new Vehicle
                    {
                        PlateNumber = normalizedPlateNumber,
                        Model = request.Model.Trim(),
                        Color = request.Color.Trim()
                    };

                    _context.Vehicles.Add(vehicle);
                    await _context.SaveChangesAsync();
                }

                var assignmentExists = await _context.VehicleAssignments
                    .AnyAsync(assignment =>
                        assignment.UserId == request.UserId &&
                        assignment.VehicleId == vehicle.VehicleId
                    );

                if (assignmentExists)
                {
                    await transaction.RollbackAsync();

                    return BadRequest(new
                    {
                        message = "This vehicle is already assigned to this user."
                    });
                }

                var assignment = new VehicleAssignment
                {
                    UserId = request.UserId,
                    VehicleId = vehicle.VehicleId,
                    AssignedAt = DateTime.Now
                };

                _context.VehicleAssignments.Add(assignment);
                await _context.SaveChangesAsync();

                await transaction.CommitAsync();

                return Ok(new
                {
                    message = isNewVehicle
                        ? "Vehicle added and assigned successfully."
                        : "Existing vehicle assigned successfully.",
                    assignmentId = assignment.AssignmentId,
                    vehicleId = vehicle.VehicleId,
                    vehicle.PlateNumber,
                    vehicle.Model,
                    vehicle.Color
                });
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }
    }
}