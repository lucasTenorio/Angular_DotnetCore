using System.Text.Json;
using angular_dotnet.Interfaces;
using angular_dotnet.Models.Entities;

namespace angular_dotnet.Models.Repositories;

public class CountryRepository : ICountryRepository
{
    private const string DatabaseCon = "DataBaseCountry.json";
    private readonly ILogger<CountryRepository> _logger;

    public CountryRepository(ILogger<CountryRepository> logger)
    {
        _logger = logger;
    }

    public async Task<IReadOnlyList<Country>> GetAllAsync()
    {
        try
        {
            var json = File.OpenRead(DatabaseCon);
            var list = await JsonSerializer.DeserializeAsync<List<Country>>(json);

            if (list != null && list.Count != 0)
                return list.AsReadOnly();
            return null;
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return null;
        }

        
    }

    public Task InsertAsync(Country model)
    {
        throw new NotImplementedException();
    }
}