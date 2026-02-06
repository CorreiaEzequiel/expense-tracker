namespace ExpenseTracker.Infrastructure.Repositories;

using ExpenseTracker.Domain.Entities;
using ExpenseTracker.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;

public class EfPersonRepository : IPersonRepository
{
    private readonly AppDbContext _db;

    public EfPersonRepository(AppDbContext db) => _db = db;

    public Task<Person?> GetByIdAsync(Guid id)
    {
        return _db.Persons.Include(p => p.Transactions).FirstOrDefaultAsync(p => p.Id == id); 
    }

    public Task AddAsync(Person person)
    {
        _db.Persons.Add(person);
        return Task.CompletedTask;
    }

    public Task<System.Collections.Generic.List<Person>> GetAllAsync()
    {
        
        return _db.Persons.ToListAsync();
    }

    public void Remove(Person person)
    {
        _db.Persons.Remove(person);
    }

    public Task SaveChangesAsync() => _db.SaveChangesAsync();
}
