using Microsoft.AspNetCore.Mvc;

namespace NamaMedical.Api.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class HematoOncologyController : ControllerBase
    {
        [HttpGet("orders")]
        public IActionResult GetOrders()
        {
            return Ok(new string[] { });
        }

        [HttpPost("orders")]
        public IActionResult CreateOrder([FromBody] object order)
        {
            return Created("", order);
        }

        [HttpGet("results")]
        public IActionResult GetResults([FromQuery] string patientId)
        {
            return Ok(new string[] { });
        }
    }
}
