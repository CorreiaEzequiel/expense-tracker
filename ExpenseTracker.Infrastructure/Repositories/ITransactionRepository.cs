namespace ExpenseTracker.Infrastructure.Repositories;

using ExpenseTracker.Domain.Entities;
using System.Linq;
using System.Threading.Tasks;

public interface ITransactionRepository
{
    IQueryable<Transaction> Query();
    IQueryable<Transaction> QueryWithIncludes();
    Task AddAsync(Transaction transaction);
    Task SaveChangesAsync();
}
