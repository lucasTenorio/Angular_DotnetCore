namespace angular_dotnet.Interfaces;

public interface IRepository<T>
{
    Task<IReadOnlyList<T>> GetAllAsync();
    Task InsertAsync(T model);
}