namespace ExpenseTracker.Infrastructure.Repositories;

using ExpenseTracker.Domain.Entities;
using ExpenseTracker.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

public class EfTransactionRepository : ITransactionRepository
{
    private readonly AppDbContext _db;

    public EfTransactionRepository(AppDbContext db) => _db = db;

    // Ensure navigation properties are included for queries that rely on related data
    // (Person.Name, Category.Description) to allow server-side translation in LINQ.
    public IQueryable<Transaction> QueryWithIncludes() => _db.Transactions
        .Include(t => t.Person)
        .Include(t => t.Category)
        .AsQueryable();

    // Backwards compatible: Query() returns QueryWithIncludes for now
    public IQueryable<Transaction> Query() => QueryWithIncludes();

    public Task AddAsync(Transaction transaction)
    {
        _db.Transactions.Add(transaction);
        return Task.CompletedTask;
    }

    public Task SaveChangesAsync() => _db.SaveChangesAsync();
}
