namespace ExpenseTracker.Infrastructure;

using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using ExpenseTracker.Infrastructure.Data;
using ExpenseTracker.Infrastructure.Repositories;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration config)
    {
        services.AddDbContext<AppDbContext>(options =>
        {
            var connectionString = config.GetConnectionString("DefaultConnection") ?? "Data Source=expense_tracker.db";
            options.UseSqlite(connectionString);
        });

        services.AddScoped<ITransactionRepository, EfTransactionRepository>();
        services.AddScoped<IPersonRepository,EfPersonRepository>();
        services.AddScoped<ICategoryRepository, EfCategoryRepository>();

        return services;
    }
}
