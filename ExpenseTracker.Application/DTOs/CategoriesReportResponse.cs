namespace ExpenseTracker.Application.DTOs;

using System.Collections.Generic;

public record CategoriesReportResponse(IEnumerable<CategorySummaryResponse> CategorySummaries, decimal TotalRevenue, decimal TotalExpense, decimal NetBalance);
