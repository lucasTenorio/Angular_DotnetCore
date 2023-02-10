using System.Collections.Generic;
using System.IO;
using angular_dotnet.Models.Entities;
using angular_dotnet.Models.Repositories;
using Microsoft.Extensions.Logging;
using Moq;
using Newtonsoft.Json;
using Xunit;

namespace angular_dotnet_tests;

public class CountryRepositoryTest
{
    private readonly CountryRepository _sut;
    private readonly Mock<ILogger<CountryRepository>> _loggerSpy = new();

    public CountryRepositoryTest()
    {
        _sut = new CountryRepository(_loggerSpy.Object);
    }

    [Fact]
    public async void ShouldReturnListOfCountries()
    {
           var result = await _sut.GetAllAsync();

        Assert.IsAssignableFrom<IReadOnlyList<Country>>(result);
    }
}