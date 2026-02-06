namespace ExpenseTracker.Infrastructure.Repositories;

using ExpenseTracker.Domain.Entities;
using System;
using System.Threading.Tasks;

public interface ICategoryRepository
{
    Task<Category?> GetByIdAsync(Guid id);
    Task AddAsync(Category category);
    Task<List<Category>> GetAllAsync();
    Task SaveChangesAsync();
}
