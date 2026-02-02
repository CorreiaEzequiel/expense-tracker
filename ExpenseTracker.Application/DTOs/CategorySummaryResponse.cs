namespace ExpenseTracker.Application.DTOs;

using System;

public record CategorySummaryResponse(Guid CategoryId, string CategoryDescription, decimal TotalRevenue, decimal TotalExpense, decimal Balance);
