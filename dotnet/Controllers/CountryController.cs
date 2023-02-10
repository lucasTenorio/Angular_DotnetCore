using angular_dotnet.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace angular_dotnet.Controllers;

[ApiController]
[Route("[controller]")]
public class CountryController : Controller
{
    [HttpGet]
    public async Task<IActionResult> GetAsync(
        [FromServices] ICountryRepository countryRepository)
    {
        var list = await countryRepository.GetAllAsync();
        return Ok(list);
    }
}