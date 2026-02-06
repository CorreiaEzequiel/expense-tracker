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

    public IQueryable<Transaction> QueryWithIncludes() => _db.Transactions
        .Include(t => t.Person)
        .Include(t => t.Category)
        .AsQueryable();

    public IQueryable<Transaction> Query() => QueryWithIncludes();

    public Task AddAsync(Transaction transaction)
    {
        _db.Transactions.Add(transaction);
        return Task.CompletedTask;
    }

    public void RemoveRange(System.Collections.Generic.IEnumerable<Transaction> transactions)
    {
        _db.Transactions.RemoveRange(transactions);
    }

    public Task SaveChangesAsync() => _db.SaveChangesAsync();
}
