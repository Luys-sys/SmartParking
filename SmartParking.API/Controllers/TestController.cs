using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartParking.API.Data;

namespace SmartParking.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TestController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("users-count")]
        public async Task<IActionResult> GetUsersCount()
        {
            var count = await _context.Users.CountAsync();
            return Ok(new { usersCount = count });
        }
    }
}