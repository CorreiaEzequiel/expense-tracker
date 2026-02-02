namespace ExpenseTracker.Application.Interfaces;

using ExpenseTracker.Application.DTOs;
using ExpenseTracker.Domain.Common;

public interface ITransactionService
{
    Task<Result<TransactionResponse>> CreateTransactionAsync(CreateTransactionRequest request);
    Task<Result<IEnumerable<CategorySummaryResponse>>> GetSummaryByCategoryAsync();
    Task<Result<ReportSummaryResponse>> GetOverallSummaryAsync();
    Task<Result<DetailedReportResponse>> GetDetailedReportAsync(Guid personId, DateTime? startDate, DateTime? endDate);
}
