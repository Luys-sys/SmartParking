using Microsoft.EntityFrameworkCore;
using SmartParking.API.Models;

namespace SmartParking.API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(
            DbContextOptions<ApplicationDbContext> options
        ) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<ParkingLot> ParkingLots { get; set; }
        public DbSet<Vehicle> Vehicles { get; set; }
        public DbSet<VehicleAssignment> VehicleAssignments { get; set; }
        public DbSet<ParkingSlot> ParkingSlots { get; set; }
        public DbSet<Reservation> Reservations { get; set; }
    }
}