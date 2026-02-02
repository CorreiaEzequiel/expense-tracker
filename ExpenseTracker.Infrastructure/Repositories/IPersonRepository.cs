namespace ExpenseTracker.Infrastructure.Repositories;

using ExpenseTracker.Domain.Entities;
using System;
using System.Threading.Tasks;

public interface IPersonRepository
{
    Task<Person?> GetByIdAsync(Guid id);
    Task AddAsync(Person person);
    Task<System.Collections.Generic.List<Person>> GetAllAsync();
    void Remove(Person person);
    Task SaveChangesAsync();
}
