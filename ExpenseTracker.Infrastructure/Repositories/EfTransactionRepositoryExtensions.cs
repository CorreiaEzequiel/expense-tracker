namespace ExpenseTracker.Infrastructure.Repositories;

using ExpenseTracker.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System.Linq;

public static class EfTransactionRepositoryExtensions
{
    public static IQueryable<Transaction> WithIncludes(this IQueryable<Transaction> query)
    {
        // Provide a default set of includes for Transaction queries performed via IQueryable
        // This ensures that consumers calling `.WithIncludes()` get navigation properties loaded
        // for server-side LINQ translation when necessary.
        return query.Include(t => t.Person).Include(t => t.Category);
    }
}
