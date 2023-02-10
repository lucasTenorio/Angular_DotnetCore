using System.Text.Json.Serialization;

namespace angular_dotnet.Models.Entities;
public class Country
{
    [JsonPropertyName("name")]
    public string Name { get; set; }
    [JsonPropertyName("vatRate")]
    public IList<float> VatRate { get; set; } = new List<float>();
}