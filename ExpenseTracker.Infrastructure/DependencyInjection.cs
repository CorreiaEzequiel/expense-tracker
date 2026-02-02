namespace ExpenseTracker.Infrastructure;

using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using ExpenseTracker.Infrastructure.Data;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration config)
    {
        // Configure DbContext
        services.AddDbContext<AppDbContext>(options =>
        {
            var connectionString = config.GetConnectionString("DefaultConnection") ?? "Data Source=expense_tracker.db";
            options.UseSqlite(connectionString);
        });

        // Register repositories here if they exist
        // Example:
        services.AddScoped<ExpenseTracker.Infrastructure.Repositories.ITransactionRepository, ExpenseTracker.Infrastructure.Repositories.EfTransactionRepository>();
        services.AddScoped<ExpenseTracker.Infrastructure.Repositories.IPersonRepository, ExpenseTracker.Infrastructure.Repositories.EfPersonRepository>();
        services.AddScoped<ExpenseTracker.Infrastructure.Repositories.ICategoryRepository, ExpenseTracker.Infrastructure.Repositories.EfCategoryRepository>();

        return services;
    }
}
