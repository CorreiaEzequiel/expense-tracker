namespace ExpenseTracker.Application;

using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using ExpenseTracker.Application.Interfaces;
using ExpenseTracker.Application.Services;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services, IConfiguration config)
    {
        services.AddScoped<ITransactionService, TransactionService>();
        services.AddScoped<IPersonService, PersonService>();
        services.AddScoped<ICategoryService, CategoryService>();
        return services;
    }
}
