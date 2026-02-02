namespace ExpenseTracker.Application.Services;

using ExpenseTracker.Application.DTOs;
using ExpenseTracker.Application.Interfaces;
using ExpenseTracker.Domain.Common;
using ExpenseTracker.Domain.Entities;
using ExpenseTracker.Domain.Entities.Enums;
using ExpenseTracker.Infrastructure.Repositories;
using System.Linq;
using Microsoft.EntityFrameworkCore;

/// <summary>
/// Serviço de transações da aplicação.
/// Implementa regras de negócio referentes à criação de transações e relatórios.
/// </summary>
public class TransactionService : ITransactionService
{
    private readonly ITransactionRepository _transactionRepository;
    private readonly IPersonRepository _personRepository;
    private readonly ICategoryRepository _categoryRepository;

    public TransactionService(
        ITransactionRepository transactionRepository,
        IPersonRepository personRepository,
        ICategoryRepository categoryRepository)
    {
        _transactionRepository = transactionRepository;
        _personRepository = personRepository;
        _categoryRepository = categoryRepository;
    }

    public async Task<Result<TransactionResponse>> CreateTransactionAsync(CreateTransactionRequest request)
    {
        var person = await _personRepository.GetByIdAsync(request.PersonId);
        if (person == null) return Result<TransactionResponse>.Error("Pessoa não encontrada");

        var category = await _categoryRepository.GetByIdAsync(request.CategoryId);
        if (category == null) return Result<TransactionResponse>.Error("Categoria não encontrada");

        if (request.Type == TransactionType.Revenue && person.Age < 18)
            return Result<TransactionResponse>.Warning(default, "Menores de 18 anos não podem registrar receitas.");

        if (request.Type == TransactionType.Expense && category.Purpose == CategoryPurpose.Revenue)
            return Result<TransactionResponse>.Error("A categoria selecionada não suporta transações de despesa.");

        if (request.Type == TransactionType.Revenue && category.Purpose == CategoryPurpose.Expense)
            return Result<TransactionResponse>.Error("A categoria selecionada não suporta transações de receita.");

        Transaction transaction;
        try
        {
            transaction = Transaction.Create(
                request.Description,
                request.Value,
                request.Type,
                request.CategoryId,
                request.PersonId,
                category,
                person);
        }
        catch (Exception ex)
        {
            return Result<TransactionResponse>.Error(ex.Message);
        }

        try
        {
            await _transactionRepository.AddAsync(transaction);
            await _transactionRepository.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            return Result<TransactionResponse>.Error(ex.Message);
        }

        var response = new TransactionResponse(transaction.Id, transaction.Description, transaction.Value, transaction.Type, transaction.CategoryId, transaction.PersonId, transaction.CreatedAt);
        return Result<TransactionResponse>.Success(response);
    }

    public async Task<Result<IEnumerable<CategorySummaryResponse>>> GetSummaryByCategoryAsync() // atual usado
    {
        var summaries = await _transactionRepository
            .Query()
            .GroupBy(t => new { t.CategoryId, t.Category!.Description })
            .Select(g => new CategorySummaryResponse(
                g.Key.CategoryId,
                g.Key.Description,
                g.Where(t => t.Type == TransactionType.Revenue).Sum(t => t.Value),
                g.Where(t => t.Type == TransactionType.Expense).Sum(t => t.Value),
                g.Where(t => t.Type == TransactionType.Revenue).Sum(t => t.Value) - g.Where(t => t.Type == TransactionType.Expense).Sum(t => t.Value)
            ))
            .ToListAsync();

        return Result<IEnumerable<CategorySummaryResponse>>.Success(summaries);
    }

    public async Task<Result<ReportSummaryResponse>> GetOverallSummaryAsync()
    {
        var q = _transactionRepository.Query();
        var totalRevenue = await q.Where(t => t.Type == TransactionType.Revenue).SumAsync(t => t.Value);
        var totalExpense = await q.Where(t => t.Type == TransactionType.Expense).SumAsync(t => t.Value);
        var net = totalRevenue - totalExpense;
        return Result<ReportSummaryResponse>.Success(new ReportSummaryResponse(totalRevenue, totalExpense, net));
    }

    // New method: Detailed report by person
    public async Task<Result<DetailedReportResponse>> GetDetailedReportAsync(Guid personId, DateTime? startDate, DateTime? endDate)
    {
        if (startDate.HasValue && endDate.HasValue && startDate > endDate)
            return Result<DetailedReportResponse>.Error("A data inicial não pode ser maior que a data final.");

        var q = _transactionRepository.Query()
            .Where(t => t.PersonId == personId);

        if (startDate.HasValue)
            q = q.Where(t => t.CreatedAt >= startDate.Value);

        if (endDate.HasValue)
            q = q.Where(t => t.CreatedAt <= endDate.Value);

        var transactions = await q
            .OrderBy(t => t.CreatedAt)
            .Select(t => new
            {
                t.CreatedAt,
                Category = t.Category!.Description,
                t.Description,
                t.Value,
                t.Type,
                Year = t.CreatedAt.Year,
                Month = t.CreatedAt.Month,
                PersonName = t.Person!.Name
            })
            .ToListAsync();

        if (!transactions.Any())
        {
            var person = await _personRepository.GetByIdAsync(personId);
            var name = person?.Name ?? string.Empty;
            var emptyResponse = new DetailedReportResponse(name, 0m, Array.Empty<MonthlyGroup>());
            return Result<DetailedReportResponse>.Success(emptyResponse);
        }

        var personName = transactions.First().PersonName;

        var monthlyGroups = transactions
            .GroupBy(t => new { t.Year, t.Month })
            .Select(g =>
            {
                var totalRevenue = g.Where(x => x.Type == TransactionType.Revenue).Sum(x => x.Value); 
                var totalExpense = g.Where(x => x.Type == TransactionType.Expense).Sum(x => x.Value);
                var balance = totalRevenue - totalExpense;
                var details = g.Select(x => new TransactionDetail(x.CreatedAt, x.Category, x.Description, x.Value, x.Type)).ToList();
                return new MonthlyGroup(g.Key.Year, g.Key.Month, totalRevenue, totalExpense, balance, details);
            })
            .OrderBy(m => m.Year).ThenBy(m => m.Month)
            .ToList();

        var netBalance = monthlyGroups.Sum(m => m.Balance);

        var responseObj = new DetailedReportResponse(personName, netBalance, monthlyGroups);
        return Result<DetailedReportResponse>.Success(responseObj);
    }
}
